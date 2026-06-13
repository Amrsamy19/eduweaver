import { Pool, Client } from 'pg';

const globalForPool = global;

// Invalidate cached pool if the connection string changed (e.g. .env hot-reload)
const currentUrl = process.env.DATABASE_URL || '';
if (globalForPool.pgPoolUrl && globalForPool.pgPoolUrl !== currentUrl) {
  // Connection string changed — destroy old pool
  if (globalForPool.pgPool) {
    globalForPool.pgPool.end().catch(() => {});
  }
  globalForPool.pgPool = null;
}

function createPool() {
  const connStr = process.env.DATABASE_URL;
  if (!connStr) {
    console.warn('[DB] No DATABASE_URL set — database queries will fail.');
    return new Pool(); // empty pool, will error on use
  }
  const isLocal = connStr.includes('localhost') || connStr.includes('127.0.0.1') || connStr.includes('sslmode=disable');
  return new Pool({
    connectionString: connStr,
    ssl: isLocal ? false : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
  });
}

export const pool = globalForPool.pgPool || createPool();

if (process.env.NODE_ENV !== 'production') {
  globalForPool.pgPool = pool;
  globalForPool.pgPoolUrl = currentUrl;
}

export const query = (text, params) => pool.query(text, params);

// Initialize database and tables
export async function initDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return;

  try {
    // 1. Parse connection string to get the database name
    const url = new URL(databaseUrl);
    const dbName = url.pathname.slice(1).split('?')[0];

    if (dbName && dbName !== 'postgres' && dbName !== 'template1') {
      // 2. Connect to the default "postgres" database to check/create target DB
      const defaultUrlObj = new URL(databaseUrl);
      defaultUrlObj.pathname = '/postgres';
      const defaultUrl = defaultUrlObj.toString();
      const isLocal = defaultUrl.includes('localhost') || defaultUrl.includes('127.0.0.1') || defaultUrl.includes('sslmode=disable');

      const client = new Client({
        connectionString: defaultUrl,
        ssl: isLocal ? false : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
      });

      await client.connect();

      const dbCheckRes = await client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName]
      );

      if (dbCheckRes.rows.length === 0) {
        console.log(`[DB] Database "${dbName}" does not exist. Creating it now...`);
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`[DB] Database "${dbName}" created successfully!`);
      }

      await client.end();
    }
  } catch (error) {
    console.error('[DB] Warning during database check/creation:', error.message);
  }

  // 3. Create tables in the target database
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

      CREATE TABLE IF NOT EXISTS subjects (
        id VARCHAR(255) PRIMARY KEY,
        grade VARCHAR(100),
        name VARCHAR(255),
        teacher VARCHAR(255),
        description TEXT,
        lecture_date VARCHAR(255),
        price VARCHAR(100),
        video_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS enrollments (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        subject_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(255) PRIMARY KEY,
        subject_id VARCHAR(255),
        title VARCHAR(255),
        teacher VARCHAR(255),
        event_date TIMESTAMP,
        duration VARCHAR(50),
        type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        amount VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Paid',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE subjects ADD COLUMN IF NOT EXISTS teacher_id VARCHAR(255);
      ALTER TABLE subjects ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;
      ALTER TABLE subjects ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        title VARCHAR(255),
        message TEXT,
        type VARCHAR(100),
        unread BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subject_views (
        id VARCHAR(255) PRIMARY KEY,
        subject_id VARCHAR(255),
        user_id VARCHAR(255),
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[DB] Tables verified/created successfully.');
  } catch (error) {
    console.error('[DB] Table initialization error:', error.message);
  }
}

// Self-execute on module load
if (process.env.DATABASE_URL) {
  initDb().catch(err => console.error('[DB] Self-init error:', err.message));
}
