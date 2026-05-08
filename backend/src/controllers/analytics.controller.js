import prisma from '../config/db.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Get dashboard overview
 */
export const getDashboardSummary = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Total Spent this month
  const totalSpentAgg = await prisma.expense.aggregate({
    where: {
      userId,
      date: { gte: startOfMonth }
    },
    _sum: { amount: true }
  });
  const totalSpent = totalSpentAgg._sum.amount || 0;

  // 2. Total Budget for this month
  const budgets = await prisma.budget.findMany({
    where: { userId, period: 'monthly' }
  });
  const totalBudget = budgets.reduce((acc, b) => acc + Number(b.limitAmount), 0);

  // 3. Recent Expenses (last 5)
  const recentExpenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 5,
    include: { category: true }
  });

  // 4. Category with most spending this month
  const categorySpending = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: {
      userId,
      date: { gte: startOfMonth }
    },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 1
  });

  let topCategory = null;
  if (categorySpending.length > 0) {
    const cat = await prisma.category.findUnique({
      where: { id: categorySpending[0].categoryId }
    });
    topCategory = {
      ...cat,
      amount: categorySpending[0]._sum.amount
    };
  }

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalSpent,
        totalBudget,
        budgetUsage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
        topCategory
      },
      recentExpenses
    }
  });
});

/**
 * Get spending distribution by category
 */
export const getCategoryDistribution = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const distribution = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: {
      userId,
      date: { gte: startOfMonth }
    },
    _sum: { amount: true }
  });

  const categories = await prisma.category.findMany();
  const catMap = categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat }), {});

  const data = distribution.map(item => ({
    name: catMap[item.categoryId]?.name || 'Unknown',
    amount: item._sum.amount,
    color: catMap[item.categoryId]?.color || '#000000',
    icon: catMap[item.categoryId]?.icon || 'question'
  }));

  res.status(200).json({
    status: 'success',
    data: { distribution: data }
  });
});

/**
 * Get monthly trends (last 6 months)
 */
export const getMonthlyTrends = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const trends = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    const agg = await prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: start,
          lte: end
        }
      },
      _sum: { amount: true }
    });

    trends.push({
      month: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      amount: agg._sum.amount || 0
    });
  }

  res.status(200).json({
    status: 'success',
    data: { trends }
  });
});
