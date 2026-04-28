import { LoanModel } from '../models/loanModel.js';

export const LoanController = {
  async createLoan(req, res) {
    const { book_id, member_id, due_date } = req.body;
    try {
      const loan = await LoanModel.createLoan(book_id, member_id, due_date);
      res.status(201).json({
        message: "Peminjaman berhasil dicatat!",
        data: loan
      });
    } catch (err) {
      // Jika stok habis atau ID salah, kirim status 400 (Bad Request)
      res.status(400).json({ error: err.message });
    }
  },

  async getLoans(req, res) {
    try {
      const loans = await LoanModel.getAllLoans();
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getTopBorrowers(req, res) {
  try {
    const rows = await LoanModel.getTopBorrowers();
    const data = rows.map(r => ({
      member_id: r.member_id,
      full_name: r.full_name,
      email: r.email,
      member_type: r.member_type,
      total_loans: r.total_loans,
      last_loan_date: r.last_loan_date,
      favorite_book: {
        title: r.favorite_book_title,
        times_borrowed: r.favorite_book_times
      }
    }));
    res.json({ message: 'Top 3 peminjam buku berhasil diambil', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
},
};
