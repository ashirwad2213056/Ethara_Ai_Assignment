import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
    const userCount = await prisma.user.count()
    console.log(`Current user count: ${userCount}`)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
