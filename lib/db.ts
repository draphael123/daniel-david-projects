import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is set with correct absolute path
// This prevents "Unable to open database file" errors in Next.js
if (!process.env.DATABASE_URL) {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  // Use forward slashes for SQLite file:// URLs (works on Windows too)
  process.env.DATABASE_URL = `file:${dbPath.replace(/\\/g, '/')}`
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

// Prevent multiple instances in serverless environments
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} else {
  globalForPrisma.prisma = prisma
}

