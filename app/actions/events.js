'use server';

import { query } from '@/app/lib/db';

/**
 * Fetch all events, optionally filtered by month and year.
 * For now we just fetch all and let the client filter by day, 
 * but you could add a date range query here.
 */
export async function getEvents() {
  try {
    const res = await query('SELECT * FROM events ORDER BY event_date ASC');
    return res.rows;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}
