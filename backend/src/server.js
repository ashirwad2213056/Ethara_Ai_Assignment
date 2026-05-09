import os from 'os';
import app from './app.js';
import { env } from './config/env.js';
import prisma from './config/db.js';
import { cleanupDuplicateCategories } from './utils/cleanup.js';

// const PORT = parseInt(env.PORT || process.env.PORT || '3000', 10);
const PORT = parseInt(process.env.PORT || env.PORT || '3000', 10);

async function main() {
  // Verify DB connection before accepting traffic
  await prisma.$connect();
  console.log('✅  Database connected');

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀  SpendWise API running on http://0.0.0.0:${PORT}/api/v1`);
    console.log(`    Environment: ${env.NODE_ENV}`);

    // Log local IPs to help user configure mobile app
    const nets = os.networkInterfaces();
    console.log('📡  Available on your local network at:');
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        // Skip internal (loopback) and non-IPv4 addresses
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`    → http://${net.address}:${PORT}/api/v1  (${name})`);
        }
      }
    }
    console.log('\n📝  Note: Use one of the addresses above in mobile/src/api/client.js');
  });

  // Run cleanup in background so server starts immediately
  cleanupDuplicateCategories().catch(err => {
    console.error('⚠️  Background cleanup failed:', err);
  });
}

main().catch((err) => {
  console.error('❌  Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\n🛑  Server shut down gracefully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});