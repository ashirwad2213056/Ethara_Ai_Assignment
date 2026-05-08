import prisma from '../config/db.js';

/**
 * Finds and removes duplicate categories, re-linking any existing
 * expenses or budgets to the primary category record.
 */
export async function cleanupDuplicateCategories() {
  try {
    console.log('🧹  Starting category cleanup...');
    const allCategories = await prisma.category.findMany({
      orderBy: { isDefault: 'desc' } // prioritize keeping default ones
    });

    const groups = {};
    allCategories.forEach(cat => {
      if (!groups[cat.name]) {
        groups[cat.name] = [];
      }
      groups[cat.name].push(cat.id);
    });

    let totalDeleted = 0;

    for (const name in groups) {
      const ids = groups[name];
      if (ids.length > 1) {
        const keepId = ids[0];
        const deleteIds = ids.slice(1);

        console.log(`   • Fixing "${name}": keeping ${keepId}, merging ${deleteIds.length} duplicates`);

        // Update relations to point to the one we're keeping
        await prisma.expense.updateMany({
          where: { categoryId: { in: deleteIds } },
          data: { categoryId: keepId }
        });

        await prisma.budget.updateMany({
          where: { categoryId: { in: deleteIds } },
          data: { categoryId: keepId }
        });

        // Delete the duplicates
        const deleted = await prisma.category.deleteMany({
          where: { id: { in: deleteIds } }
        });
        
        totalDeleted += deleted.count;
      }
    }

    // ─── 2. Normalize Icon Names for Default Categories ──────────────────────
    const iconMapping = {
      'utensils': 'restaurant',
      'graduation-cap': 'school',
      'heart-pulse': 'medical',
      'house': 'home',
      'shopping-bag': 'cart',
      'ellipsis': 'ellipsis-horizontal',
      'utensil': 'restaurant', // common typo
      'graduation': 'school',
      'health': 'medical',
      'housing': 'home',
      'shopping': 'cart'
    };

    const defaults = await prisma.category.findMany({ where: { isDefault: true } });
    for (const cat of defaults) {
      const normalizedIcon = iconMapping[cat.icon] || cat.icon;
      if (normalizedIcon !== cat.icon) {
        console.log(`   • Updating icon for "${cat.name}": ${cat.icon} → ${normalizedIcon}`);
        await prisma.category.update({
          where: { id: cat.id },
          data: { icon: normalizedIcon }
        });
      }
    }

    if (totalDeleted > 0) {
      console.log(`✨  Cleanup complete. Removed ${totalDeleted} duplicates.`);
    } else {
      console.log('✅  No duplicate categories found.');
    }
  } catch (error) {
    console.error('❌  Category cleanup failed:', error);
  }
}
