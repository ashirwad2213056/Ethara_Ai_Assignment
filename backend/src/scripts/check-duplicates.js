import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const categories = await prisma.category.findMany();
  console.log(`Total categories: ${categories.length}`);
  const names = categories.map(c => c.name);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  console.log('Duplicates:', [...new Set(duplicates)]);
}

check().finally(() => prisma.$disconnect());
