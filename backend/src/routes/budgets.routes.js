import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as budgetController from '../controllers/budgets.controller.js';
import { createBudgetSchema } from '../schemas/budget.schema.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validate(createBudgetSchema), budgetController.upsertBudget);
router.get('/', budgetController.getBudgets);
router.delete('/:id', budgetController.deleteBudget);

export default router;
