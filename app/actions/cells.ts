'use server'

import { prisma } from '@/lib/db'
import { validateCellValue, parseCellValue } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function updateCell(
  rowId: string,
  columnId: string,
  rawValue: string
) {
  try {
    // Get column to validate type
    const column = await prisma.column.findUnique({
      where: { id: columnId },
    })

    if (!column) {
      return { success: false, error: 'Column not found' }
    }

    // Parse and validate value
    const parsedValue = parseCellValue(column.type, rawValue)
    
    if (parsedValue !== null && !validateCellValue(column.type, parsedValue)) {
      return { 
        success: false, 
        error: `Invalid value for ${column.type} column` 
      }
    }

    // Upsert cell - SQLite stores JSON as string
    const valueJson = parsedValue !== null ? JSON.stringify(parsedValue) : null
    
    const cell = await prisma.cell.upsert({
      where: {
        rowId_columnId: {
          rowId,
          columnId,
        },
      },
      update: {
        valueJson,
      },
      create: {
        rowId,
        columnId,
        valueJson,
      },
    })

    revalidatePath('/')
    return { success: true, data: cell }
  } catch (error: any) {
    console.error('Error updating cell:', error)
    return { success: false, error: error.message || 'Failed to update cell' }
  }
}

