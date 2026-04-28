import { BookModel } from '../models/bookModel.js';

export const BookController = {
  async getAllBooks(req, res) {
    try {
      const books = await BookModel.getAll(req.query.title);
      res.json({ message: 'Data buku berhasil diambil', data: books });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getBookById(req, res) {
    try {
      const book = await BookModel.getById(req.params.id);
      if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan' });
      res.json({ message: 'Data buku berhasil diambil', data: book });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createBook(req, res) {
    try {
      const book = await BookModel.create(req.body);
      res.status(201).json({ message: 'Buku berhasil ditambahkan', data: book });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateBook(req, res) {
    try {
      const book = await BookModel.update(req.params.id, req.body);
      if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan' });
      res.json({ message: 'Buku berhasil diperbarui', data: book });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteBook(req, res) {
    try {
      const book = await BookModel.getById(req.params.id);
      if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan' });
      await BookModel.delete(req.params.id);
      res.json({ message: 'Buku berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
