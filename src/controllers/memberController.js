import { MemberModel } from '../models/memberModel.js';

export const MemberController = {
  async getAllMembers(req, res) {
    try {
      const members = await MemberModel.getAll();
      res.json({ message: 'Data anggota berhasil diambil', data: members });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getMemberById(req, res) {
    try {
      const member = await MemberModel.getById(req.params.id);
      if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
      res.json({ message: 'Data anggota berhasil diambil', data: member });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async registerMember(req, res) {
    try {
      const member = await MemberModel.create(req.body);
      res.status(201).json({ message: 'Anggota berhasil didaftarkan', data: member });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateMember(req, res) {
    try {
      const member = await MemberModel.update(req.params.id, req.body);
      if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
      res.json({ message: 'Data anggota berhasil diperbarui', data: member });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteMember(req, res) {
    try {
      const member = await MemberModel.getById(req.params.id);
      if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
      await MemberModel.delete(req.params.id);
      res.json({ message: 'Anggota berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
