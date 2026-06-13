'use server';

import { query } from '@/app/lib/db';
import { auth } from '@/auth';

/**
 * Fetch the transaction history for the logged-in user
 */
export async function getUserTransactions() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    const userId = session.user.id;
    const res = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', 
      [userId]
    );
    
    return res.rows;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}
