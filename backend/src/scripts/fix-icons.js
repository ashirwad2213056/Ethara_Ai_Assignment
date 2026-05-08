import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const iconMapping = {
  'Food & Drink': 'restaurant',
  'Transport': 'car',
  'Shopping': 'cart',
  'Health': 'medical',
  'Housing': 'home',
  'Entertainment': 'film',
  'Education': 'school',
  'Other': 'ellipsis-horizontal'
};

async function updateIcons() {
  console.log('🔄 Updating category icons in database...');
  
  for (const [name, icon] of Object.entries(iconMapping)) {
    const result = await prisma.category.updateMany({
      where: { name: name },
      data: { icon: icon }
    });
    console.log(`✅ Updated ${result.count} entries for category "${name}" to icon "${icon}"`);
  }
}

updateIcons()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
