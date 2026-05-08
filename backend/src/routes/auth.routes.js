import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, refreshSchema } from '../schemas/auth.schema.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), authController.login);

// POST /api/v1/auth/refresh
router.post('/refresh', validate(refreshSchema), authController.refresh);

// POST /api/v1/auth/logout
router.post('/logout', authController.logout);

export default router;
