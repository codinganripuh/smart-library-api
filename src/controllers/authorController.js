import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {
  async getAuthors(req, res) {
    try {
      const authors = await AuthorModel.getAll(req.query.name);
      res.json({ message: 'Data penulis berhasil diambil', data: authors });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAuthorById(req, res) {
    try {
      const author = await AuthorModel.getById(req.params.id);
      if (!author) return res.status(404).json({ error: 'Penulis tidak ditemukan' });
      res.json({ message: 'Data penulis berhasil diambil', data: author });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async addAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.create(name, nationality);
      res.status(201).json({ message: 'Penulis berhasil ditambahkan', data: author });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.update(req.params.id, name, nationality);
      if (!author) return res.status(404).json({ error: 'Penulis tidak ditemukan' });
      res.json({ message: 'Penulis berhasil diperbarui', data: author });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteAuthor(req, res) {
    try {
      const author = await AuthorModel.getById(req.params.id);
      if (!author) return res.status(404).json({ error: 'Penulis tidak ditemukan' });
      await AuthorModel.delete(req.params.id);
      res.json({ message: 'Penulis berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
