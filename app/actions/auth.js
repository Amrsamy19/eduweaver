'use server';

import { signIn, signOut } from '@/auth';
import { query } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import crypto from 'crypto';

/**
 * Register a new user (Student or Teacher)
 */
export async function register(prevState, formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role') || 'STUDENT'; // STUDENT or TEACHER

    if (!name || !email || !password) {
      return { error: 'Please fill in all fields.' };
    }

    // Check if user already exists
    const existingRes = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingRes.rows.length > 0) {
      return { error: 'A user with this email already exists.' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const description = role === 'TEACHER' 
      ? 'Senior subject instructor on Eduweaver.' 
      : 'Highly motivated student aiming for success.';
    const grade = role === 'STUDENT' ? 'First Grade' : null;
    const lectureDate = role === 'TEACHER' ? 'Every Wednesday' : null;
    const price = role === 'TEACHER' ? '170 L.E / Month' : null;
    const subject = role === 'TEACHER' ? 'English' : null;

    // Insert user
    await query(
      `INSERT INTO users (
        id, name, email, password, role, description, grade, lecture_date, price, subject
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [userId, name, email, hashedPassword, role, description, grade, lectureDate, price, subject]
    );

    return { success: true, message: 'Registration successful! You can now log in.' };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Something went wrong during registration.' };
  }
}

/**
 * Log in an existing user
 */
export async function login(prevState, formData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return { error: 'Please enter both email and password.' };
    }

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' };
        default:
          return { error: 'Authentication failed.' };
      }
    }
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Login error:', error);
    return { error: 'Invalid email or password.' };
  }
}

/**
 * Log out the user
 */
export async function logout() {
  await signOut({ redirectTo: '/' });
}

/**
 * Update user profile details
 */
export async function updateProfile(userId, profileData) {
  try {
    // Dynamically build the update query to prevent overwriting missing columns with null
    const keys = Object.keys(profileData);
    if (keys.length === 0) return { success: true };

    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const key of keys) {
      // Map JS camelCase keys to Database snake_case columns
      let colName = key;
      if (key === 'lectureDate') colName = 'lecture_date';

      setClauses.push(`${colName} = $${idx}`);
      values.push(profileData[key]);
      idx++;
    }

    // Add updated_at
    setClauses.push(`updated_at = NOW()`);
    
    // Add userId to values
    values.push(userId);
    const queryText = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idx}`;

    await query(queryText, values);

    // Get the updated user profile
    const userRes = await query('SELECT * FROM users WHERE id = $1', [userId]);
    return { success: true, user: userRes.rows[0] };
  } catch (error) {
    console.error('Update profile error:', error);
    return { error: 'Failed to update profile.' };
  }
}

/**
 * Get the current user profile from database
 */
export async function getUserProfile(email) {
  try {
    if (!email) return null;
    const res = await query(
      `SELECT 
        id, 
        name, 
        email, 
        role, 
        phone, 
        description, 
        grade, 
        interests, 
        gender, 
        lecture_date AS "lectureDate", 
        price, 
        subject 
      FROM users WHERE email = $1`,
      [email]
    );
    return res.rows[0] || null;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}
