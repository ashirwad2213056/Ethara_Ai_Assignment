import prisma from '../config/db.js';

export const createExpense = async (req, res, next) => {
  try {
    const { categoryId, amount, title, note, date } = req.body;
    const userId = req.user.id;

    // Verify category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        categoryId,
        amount,
        title,
        note,
        date: new Date(date),
      },
      include: {
        category: true,
      },
    });

    // --- Budget Alert Logic ---
    const budget = await prisma.budget.findUnique({
      where: {
        userId_categoryId_period: {
          userId,
          categoryId,
          period: 'monthly' // Default to monthly for now
        }
      }
    });

    let budgetAlert = null;
    if (budget && !budget.alertSent) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const aggregation = await prisma.expense.aggregate({
        where: {
          userId,
          categoryId,
          date: { gte: startOfMonth }
        },
        _sum: { amount: true }
      });

      const totalSpent = aggregation._sum.amount || 0;
      if (totalSpent > budget.limitAmount) {
        // Trigger notification (Simulated for now)
        console.log(`🚨 ALERT: User ${userId} exceeded budget for ${category.name}!`);
        budgetAlert = {
          categoryName: category.name,
          limitAmount: budget.limitAmount,
          totalSpent
        };
        
        await prisma.budget.update({
          where: { id: budget.id },
          data: { alertSent: true }
        });
      }
    }
    // ---------------------------

    res.status(201).json({
      ...expense,
      budgetAlert
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, categoryId, search, sortBy = 'date', order = 'desc' } = req.query;

    const whereClause = {
      userId,
    };

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate);
      if (endDate) whereClause.date.lte = new Date(endDate);
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { note: { contains: search, mode: 'insensitive' } },
      ];
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        [sortBy]: order,
      },
    });

    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { categoryId, amount, title, note, date } = req.body;

    // Verify expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        ...(categoryId && { categoryId }),
        ...(amount !== undefined && { amount }),
        ...(title && { title }),
        ...(note !== undefined && { note }),
        ...(date && { date: new Date(date) }),
      },
      include: {
        category: true,
      },
    });

    res.json(updatedExpense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await prisma.expense.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
