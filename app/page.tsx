import { DatabaseView } from '@/components/DatabaseView'
import { prisma } from '@/lib/db'

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

export default async function Home() {
  const dbConnected = await checkDatabaseConnection()
  
  // Auto-seed if no columns exist
  const columnCount = await prisma.column.count()
  if (columnCount === 0) {
    // This will be handled by the seed script, but we can trigger it here if needed
    console.log('No columns found. Run: npm run db:seed')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <DatabaseView dbConnected={dbConnected} />
    </main>
  )
}

