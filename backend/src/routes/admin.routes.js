import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/users', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.patch('/users/:id/role', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/stats', (req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
