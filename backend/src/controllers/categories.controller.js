import prisma from '../config/db.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, icon, color } = req.body;
    
    // In our current schema, categories are global. 
    // We can add a check here if we only want admins to create global categories.
    // For now, we'll allow any authenticated user to create a category as per Phase 3 requirements.

    const category = await prisma.category.create({
      data: {
        name,
        icon,
        color,
        isDefault: false,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};
