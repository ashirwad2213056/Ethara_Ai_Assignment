/**
 * Prisma seed — populates the 8 default categories
 * Run: node prisma/seed.js (after npm install)
 */
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Food & Drink',    icon: 'restaurant',          color: '#F5A623', isDefault: true },
  { name: 'Transport',       icon: 'car',                 color: '#4AABF5', isDefault: true },
  { name: 'Shopping',        icon: 'cart',                color: '#E879B0', isDefault: true },
  { name: 'Health',          icon: 'medical',             color: '#22C983', isDefault: true },
  { name: 'Housing',         icon: 'home',                color: '#7C6EF5', isDefault: true },
  { name: 'Entertainment',   icon: 'film',                color: '#F5515F', isDefault: true },
  { name: 'Education',       icon: 'school',              color: '#5DCDF5', isDefault: true },
  { name: 'Other',           icon: 'ellipsis-horizontal', color: '#8E8BA8', isDefault: true },
];

async function main() {
  console.log('🌱  Seeding default categories...');

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: category,
      create: category,
    });
  }

  console.log(`✅  Seeded ${defaultCategories.length} categories`);

  const all = await prisma.category.findMany({ where: { isDefault: true } });
  console.log(`📋  Total default categories: ${all.length}`);
  all.forEach((c) => console.log(`   • ${c.icon.padEnd(16)} ${c.name} (${c.color})`));
}

main()
  .catch((err) => {
    console.error('❌  Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
