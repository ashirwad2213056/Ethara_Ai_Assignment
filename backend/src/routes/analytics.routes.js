import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/summary', analyticsController.getDashboardSummary);
router.get('/distribution', analyticsController.getCategoryDistribution);
router.get('/trends', analyticsController.getMonthlyTrends);

export default router;
