import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Create or update a budget
 */
export const upsertBudget = catchAsync(async (req, res) => {
  const { categoryId, limitAmount, period } = req.body;
  const userId = req.user.id;

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const budget = await prisma.budget.upsert({
    where: {
      userId_categoryId_period: {
        userId,
        categoryId,
        period: period || 'monthly'
      }
    },
    update: {
      limitAmount,
    },
    create: {
      userId,
      categoryId,
      limitAmount,
      period: period || 'monthly'
    }
  });

  res.status(201).json({
    status: 'success',
    data: { budget }
  });
});

/**
 * Get all budgets for user with current spending
 */
export const getBudgets = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      category: true
    }
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start of week
  startOfWeek.setHours(0, 0, 0, 0);

  // For each budget, calculate current spending
  const budgetsWithSpending = await Promise.all(
    budgets.map(async (budget) => {
      const startDate = budget.period === 'monthly' ? startOfMonth : startOfWeek;
      
      const aggregation = await prisma.expense.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          date: {
            gte: startDate
          }
        },
        _sum: {
          amount: true
        }
      });

      return {
        ...budget,
        spentAmount: aggregation._sum.amount || 0
      };
    })
  );

  res.status(200).json({
    status: 'success',
    data: { budgets: budgetsWithSpending }
  });
});

/**
 * Delete a budget
 */
export const deleteBudget = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const budget = await prisma.budget.findFirst({
    where: { id, userId }
  });

  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }

  await prisma.budget.delete({
    where: { id }
  });

  res.status(204).send();
});
