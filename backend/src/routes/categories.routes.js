import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema } from '../schemas/category.schema.js';
import { getAllCategories, createCategory } from '../controllers/categories.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllCategories);
router.post('/', validate(createCategorySchema), createCategory);
router.delete('/:id', (req, res) => res.status(501).json({ message: 'Delete not implemented for Categories yet' }));

export default router;
