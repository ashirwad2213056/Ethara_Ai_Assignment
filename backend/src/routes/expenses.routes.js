import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createExpenseSchema,
  updateExpenseSchema,
  getExpensesQuerySchema,
} from '../schemas/expense.schema.js';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../controllers/expenses.controller.js';

const router = Router();

router.use(authenticate); // all expense routes require auth

router.get('/', validate(getExpensesQuerySchema), getExpenses);
router.post('/', validate(createExpenseSchema), createExpense);
router.get('/:id', getExpenseById);
router.put('/:id', validate(updateExpenseSchema), updateExpense);
router.delete('/:id', deleteExpense);

export default router;
