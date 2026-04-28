import { pool } from '../config/db.js';

export const BookModel = {
  async getAll(title) {
    const base = `
      SELECT b.*, a.name AS author_name, c.name AS category_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
    `;
    if (title) {
      const result = await pool.query(base + ' WHERE b.title ILIKE $1 ORDER BY b.title ASC', [`%${title}%`]);
      return result.rows;
    }
    const result = await pool.query(base + ' ORDER BY b.title ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`
      SELECT b.*, a.name AS author_name, c.name AS category_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = $1
    `, [id]);
    return result.rows[0];
  },

  async create(data) {
    const { isbn, title, author_id, category_id, total_copies } = data;
    const result = await pool.query(
      `INSERT INTO books (isbn, title, author_id, category_id, total_copies, available_copies)
       VALUES ($1, $2, $3, $4, $5, $5) RETURNING *`,
      [isbn, title, author_id, category_id, total_copies]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { isbn, title, author_id, category_id, total_copies } = data;
    const result = await pool.query(
      `UPDATE books SET isbn = $1, title = $2, author_id = $3, category_id = $4, total_copies = $5
       WHERE id = $6 RETURNING *`,
      [isbn, title, author_id, category_id, total_copies, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
  }
};
