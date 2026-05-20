import { Pool } from 'pg';

const globalForPool = global;

export const pool = globalForPool.pgPool || new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('sslmode=disable') || process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1'))
    ? false 
    : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false)
});

if (process.env.NODE_ENV !== 'production') globalForPool.pgPool = pool;

export const query = (text, params) => pool.query(text, params);

// Initialize database tables
export async function initDb() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'STUDENT',
        phone VARCHAR(100),
        description TEXT,
        grade VARCHAR(100),
        interests TEXT,
        gender VARCHAR(50),
        lecture_date VARCHAR(255),
        price VARCHAR(100),
        subject VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables verified/created successfully.');
  } catch (error) {
    console.error('Database initialization warning (make sure PG is running and DATABASE_URL is correct):', error.message);
  }
}

// Self-execute database initialization
if (process.env.DATABASE_URL) {
  initDb().catch(err => console.error('Database self-init error:', err));
}
