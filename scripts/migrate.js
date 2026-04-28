import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log('Running migrations...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS authors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      nationality TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS books (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      isbn TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
      category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
      total_copies INTEGER DEFAULT 1,
      available_copies INTEGER DEFAULT 1
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      member_type TEXT CHECK (member_type IN ('STUDENT', 'FACULTY', 'STAFF')),
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS loans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      book_id UUID REFERENCES books(id),
      member_id UUID REFERENCES members(id),
      loan_date DATE DEFAULT CURRENT_DATE,
      due_date DATE NOT NULL,
      return_date DATE,
      status TEXT CHECK (status IN ('BORROWED', 'RETURNED', 'OVERDUE')) DEFAULT 'BORROWED'
    )
  `);

  console.log('Migrations completed.');
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});