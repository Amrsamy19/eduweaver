import { Pool, Client } from 'pg';

const globalForPool = global;

export const pool = globalForPool.pgPool || new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('sslmode=disable') || process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1'))
    ? false 
    : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false)
});

if (process.env.NODE_ENV !== 'production') globalForPool.pgPool = pool;

export const query = (text, params) => pool.query(text, params);

// Initialize database tables and check/create database if it doesn't exist
export async function initDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return;

  try {
    // 1. Parse connection string to get the database name
    const url = new URL(databaseUrl);
    const dbName = url.pathname.slice(1).split('?')[0]; // strip query parameters if any

    if (dbName && dbName !== 'postgres' && dbName !== 'template1') {
      // 2. Create connection string to default postgres database
      const defaultUrlObj = new URL(databaseUrl);
      defaultUrlObj.pathname = '/postgres';
      const defaultUrl = defaultUrlObj.toString();

      // 3. Connect to default postgres DB using a temporary client
      const client = new Client({
        connectionString: defaultUrl,
        ssl: defaultUrl.includes('sslmode=disable') || defaultUrl.includes('localhost') || defaultUrl.includes('127.0.0.1')
          ? false 
          : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false)
      });

      await client.connect();

      // 4. Check if the target database exists
      const dbCheckRes = await client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName]
      );

      if (dbCheckRes.rows.length === 0) {
        console.log(`Database "${dbName}" does not exist. Creating it now...`);
        // Note: CREATE DATABASE cannot run inside a transaction, and we must double-quote the identifier
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database "${dbName}" created successfully!`);
      }

      await client.end();
    }
  } catch (error) {
    console.error('Warning during check/creation of database:', error.message);
  }

  // 5. Connect and initialize tables in the target database
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
    console.error('Database tables initialization warning:', error.message);
  }
}

// Self-execute database initialization
if (process.env.DATABASE_URL) {
  initDb().catch(err => console.error('Database self-init error:', err));
}
