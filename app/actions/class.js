'use server';

import { query } from '@/app/lib/db';
import { auth } from '@/auth';
import crypto from 'crypto';

/**
 * Fetch all available subjects/classes for a specific grade
 */
export async function getSubjectsByGrade(grade) {
  try {
    const res = await query('SELECT * FROM subjects WHERE grade = $1 AND is_deleted = FALSE ORDER BY name ASC', [grade]);
    return res.rows;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
}

/**
 * Fetch a specific subject by its name
 */
export async function getSubjectByName(name) {
  try {
    const res = await query('SELECT * FROM subjects WHERE name = $1 AND is_deleted = FALSE LIMIT 1', [name]);
    return res.rows[0] || null;
  } catch (error) {
    console.error('Error fetching subject by name:', error);
    return null;
  }
}

export async function watchSubject(subjectId) {
  try {
    const session = await auth();
    if (!session?.user) return { error: 'Not logged in' };
    
    // Increment total views
    await query(`UPDATE subjects SET views = views + 1 WHERE id = $1`, [subjectId]);
    
    // Log student view
    const viewId = crypto.randomUUID();
    await query(
      `INSERT INTO subject_views (id, subject_id, user_id) VALUES ($1, $2, $3)`,
      [viewId, subjectId, session.user.id]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Watch error:', error);
    return { error: 'Failed to record view' };
  }
}

// ==========================================
// TEACHER ACTIONS
// ==========================================

export async function createSubject(subjectData) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return { error: 'Unauthorized: Only teachers can create courses.' };
    }

    const { name, grade, description, lectureDate, price, videoUrl } = subjectData;
    const subjectId = crypto.randomUUID();
    const teacherId = session.user.id;
    const teacherName = session.user.name;

    await query(
      `INSERT INTO subjects (id, grade, name, teacher, teacher_id, description, lecture_date, price, video_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [subjectId, grade, name, teacherName, teacherId, description, lectureDate, price, videoUrl]
    );

    // Notify all students
    const studentsRes = await query(`SELECT id FROM users WHERE role = 'STUDENT'`);
    for (let row of studentsRes.rows) {
      const notifId = crypto.randomUUID();
      await query(
        `INSERT INTO notifications (id, user_id, title, message, type) VALUES ($1, $2, $3, $4, $5)`,
        [notifId, row.id, 'New Course Added!', `Professor ${teacherName} added a new course: ${name}.`, 'lecture']
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating subject:', error);
    return { error: 'Failed to create course.' };
  }
}

export async function updateSubject(subjectId, updates) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return { error: 'Unauthorized' };
    }
    // Simplistic update - in reality, dynamically build SET query
    const { name, grade, description, lectureDate, price, videoUrl } = updates;
    await query(
      `UPDATE subjects SET name = $1, grade = $2, description = $3, lecture_date = $4, price = $5, video_url = $6 
       WHERE id = $7 AND teacher_id = $8`,
      [name, grade, description, lectureDate, price, videoUrl, subjectId, session.user.id]
    );
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update course.' };
  }
}

export async function deleteSubject(subjectId) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return { error: 'Unauthorized' };
    }
    // Soft delete
    await query(`UPDATE subjects SET is_deleted = TRUE WHERE id = $1 AND teacher_id = $2`, [subjectId, session.user.id]);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete course.' };
  }
}

export async function getTeacherSubjects() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') return [];

    const res = await query('SELECT * FROM subjects WHERE teacher_id = $1 AND is_deleted = FALSE ORDER BY created_at DESC', [session.user.id]);
    return res.rows;
  } catch (error) {
    return [];
  }
}

export async function getTeacherAnalytics() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') return { totalViews: 0, enrollmentsCount: 0, studentViews: [] };

    const teacherId = session.user.id;

    const subjectsRes = await query('SELECT id, views FROM subjects WHERE teacher_id = $1', [teacherId]);
    const totalViews = subjectsRes.rows.reduce((sum, s) => sum + (s.views || 0), 0);

    const enrollRes = await query(
      `SELECT COUNT(*) FROM enrollments e JOIN subjects s ON e.subject_id = s.id WHERE s.teacher_id = $1`,
      [teacherId]
    );
    const enrollmentsCount = parseInt(enrollRes.rows[0].count, 10);

    const viewsRes = await query(
      `SELECT v.viewed_at, u.name as student_name, s.name as subject_name 
       FROM subject_views v 
       JOIN users u ON v.user_id = u.id 
       JOIN subjects s ON v.subject_id = s.id 
       WHERE s.teacher_id = $1 
       ORDER BY v.viewed_at DESC LIMIT 50`,
      [teacherId]
    );

    return {
      totalViews,
      enrollmentsCount,
      studentViews: viewsRes.rows
    };
  } catch (error) {
    console.error('Analytics error:', error);
    return { totalViews: 0, enrollmentsCount: 0, studentViews: [] };
  }
}



/**
 * Enroll the current user in a subject
 */
export async function enrollSubject(subjectId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'You must be logged in to enroll.' };
    }

    const userId = session.user.id;

    // Check if already enrolled
    const existingRes = await query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND subject_id = $2',
      [userId, subjectId]
    );

    if (existingRes.rows.length > 0) {
      return { error: 'You are already enrolled in this class.' };
    }

    const enrollmentId = crypto.randomUUID();
    await query(
      'INSERT INTO enrollments (id, user_id, subject_id) VALUES ($1, $2, $3)',
      [enrollmentId, userId, subjectId]
    );

    return { success: true, message: 'Successfully enrolled!' };
  } catch (error) {
    console.error('Enrollment error:', error);
    return { error: 'An error occurred during enrollment.' };
  }
}
