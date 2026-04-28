import express from 'express';
import { LoanController } from '../controllers/loanController.js';

const router = express.Router();

router.get('/top-borrowers', LoanController.getTopBorrowers);
router.get('/', LoanController.getLoans);
router.post('/', LoanController.createLoan);
router.patch('/:id/return', LoanController.returnBook);

export default router;
