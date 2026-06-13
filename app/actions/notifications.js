'use server';

import { query } from '@/app/lib/db';
import { auth } from '@/auth';

export async function getStudentNotifications() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    const res = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [session.user.id]
    );
    return res.rows;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function markAllNotificationsRead() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false };

    await query(
      'UPDATE notifications SET unread = FALSE WHERE user_id = $1',
      [session.user.id]
    );
    return { success: true };
  } catch (error) {
    console.error('Error marking notifications read:', error);
    return { success: false };
  }
}

export async function deleteNotification(id) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false };

    await query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
      [id, session.user.id]
    );
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false };
  }
}
