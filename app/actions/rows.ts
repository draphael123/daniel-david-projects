'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getRows() {
  try {
    const rows = await prisma.row.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        cells: {
          include: {
            column: true,
          },
        },
      },
    })
    return { success: true, data: rows }
  } catch (error) {
    console.error('Error fetching rows:', error)
    return { success: false, error: 'Failed to fetch rows' }
  }
}

export async function createRow() {
  try {
    // Get max orderIndex
    const maxRow = await prisma.row.findFirst({
      orderBy: { orderIndex: 'desc' },
    })
    const newOrderIndex = maxRow ? maxRow.orderIndex + 1 : 0

    const row = await prisma.row.create({
      data: {
        orderIndex: newOrderIndex,
      },
    })

    revalidatePath('/')
    return { success: true, data: row }
  } catch (error: any) {
    console.error('Error creating row:', error)
    return { success: false, error: error.message || 'Failed to create row' }
  }
}

export async function deleteRow(id: string) {
  try {
    await prisma.row.delete({
      where: { id },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting row:', error)
    return { success: false, error: error.message || 'Failed to delete row' }
  }
}

export async function duplicateRow(id: string) {
  try {
    const row = await prisma.row.findUnique({
      where: { id },
      include: { cells: true },
    })

    if (!row) {
      return { success: false, error: 'Row not found' }
    }

    // Get max orderIndex
    const maxRow = await prisma.row.findFirst({
      orderBy: { orderIndex: 'desc' },
    })
    const newOrderIndex = maxRow ? maxRow.orderIndex + 1 : 0

    const newRow = await prisma.row.create({
      data: {
        orderIndex: newOrderIndex,
        cells: {
          create: row.cells.map((cell) => ({
            columnId: cell.columnId,
            valueJson: cell.valueJson as any, // Prisma JsonValue type
          })),
        },
      },
    })

    revalidatePath('/')
    return { success: true, data: newRow }
  } catch (error: any) {
    console.error('Error duplicating row:', error)
    return { success: false, error: error.message || 'Failed to duplicate row' }
  }
}

export async function reorderRows(rowIds: string[]) {
  try {
    await Promise.all(
      rowIds.map((id, index) =>
        prisma.row.update({
          where: { id },
          data: { orderIndex: index },
        })
      )
    )

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error reordering rows:', error)
    return { success: false, error: error.message || 'Failed to reorder rows' }
  }
}

