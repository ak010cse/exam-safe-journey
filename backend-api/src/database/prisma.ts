import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

/**
 * Get Prisma client instance (singleton)
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const client = getPrismaClient();
    await client.$connect();
    console.log('✓ Database connected successfully');
  } catch (error) {
    console.error('✗ Failed to connect to database:', error);
    throw error;
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    console.log('✓ Database disconnected');
  }
}
