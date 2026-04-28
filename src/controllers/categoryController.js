import { CategoryModel } from '../models/categoryModel.js';

export const CategoryController = {
  async getCategories(req, res) {
    try {
      const categories = await CategoryModel.getAll(req.query.name);
      res.json({ message: 'Data kategori berhasil diambil', data: categories });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getCategoryById(req, res) {
    try {
      const category = await CategoryModel.getById(req.params.id);
      if (!category) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      res.json({ message: 'Data kategori berhasil diambil', data: category });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async addCategory(req, res) {
    try {
      const category = await CategoryModel.create(req.body.name);
      res.status(201).json({ message: 'Kategori berhasil ditambahkan', data: category });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateCategory(req, res) {
    try {
      const category = await CategoryModel.update(req.params.id, req.body.name);
      if (!category) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      res.json({ message: 'Kategori berhasil diperbarui', data: category });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteCategory(req, res) {
    try {
      const category = await CategoryModel.getById(req.params.id);
      if (!category) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      await CategoryModel.delete(req.params.id);
      res.json({ message: 'Kategori berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
