import { pool } from '../config/db.js';

export const LoanModel = {
  async createLoan(book_id, member_id, due_date) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
      if (bookCheck.rows[0].available_copies <= 0) {
        throw new Error('Buku sedang tidak tersedia (stok habis).');
      }

      await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [book_id]);

      const result = await client.query(
        'INSERT INTO loans (book_id, member_id, due_date) VALUES ($1, $2, $3) RETURNING *',
        [book_id, member_id, due_date]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getAllLoans() {
    const result = await pool.query(`
      SELECT l.*, b.title AS book_title, m.full_name AS member_name
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
      ORDER BY l.loan_date DESC
    `);
    return result.rows;
  },

  async returnBook(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const loan = await client.query('SELECT * FROM loans WHERE id = $1', [id]);
      if (loan.rows.length === 0) throw new Error('Data peminjaman tidak ditemukan');
      if (loan.rows[0].status === 'RETURNED') throw new Error('Buku ini sudah dikembalikan sebelumnya');

      const result = await client.query(
        `UPDATE loans SET status = 'RETURNED', return_date = CURRENT_DATE WHERE id = $1 RETURNING *`,
        [id]
      );

      await client.query(
        'UPDATE books SET available_copies = available_copies + 1 WHERE id = $1',
        [loan.rows[0].book_id]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getTopBorrowers() {
    const result = await pool.query(`
      WITH loan_counts AS (
        SELECT l.member_id, COUNT(*)::int AS total_loans, MAX(l.loan_date) AS last_loan_date
        FROM loans l GROUP BY l.member_id ORDER BY total_loans DESC LIMIT 3
      ),
      favorite_books AS (
        SELECT DISTINCT ON (l.member_id) l.member_id, b.title, COUNT(*)::int AS times_borrowed
        FROM loans l JOIN books b ON b.id = l.book_id
        WHERE l.member_id IN (SELECT member_id FROM loan_counts)
        GROUP BY l.member_id, b.title ORDER BY l.member_id, times_borrowed DESC
      )
      SELECT m.id AS member_id, m.full_name, m.email, m.member_type,
        lc.total_loans, lc.last_loan_date,
        fb.title AS favorite_book_title, fb.times_borrowed AS favorite_book_times
      FROM loan_counts lc
      JOIN members m ON m.id = lc.member_id
      JOIN favorite_books fb ON fb.member_id = lc.member_id
      ORDER BY lc.total_loans DESC
    `);
    return result.rows;
  }
};
