'use server'

import { prisma } from '@/lib/db'
import { createColumnSchema, updateColumnSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function getColumns() {
  try {
    const columns = await prisma.column.findMany({
      orderBy: { orderIndex: 'asc' },
    })
    return { success: true, data: columns }
  } catch (error) {
    console.error('Error fetching columns:', error)
    return { success: false, error: 'Failed to fetch columns' }
  }
}

export async function createColumn(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const orderIndex = parseInt(formData.get('orderIndex') as string)

    const validated = createColumnSchema.parse({
      name,
      type,
      orderIndex,
      settingsJson: type === 'select' || type === 'multi_select' 
        ? JSON.stringify({ options: [] })
        : null,
    })

    const column = await prisma.column.create({
      data: validated,
    })

    revalidatePath('/')
    return { success: true, data: column }
  } catch (error: any) {
    console.error('Error creating column:', error)
    return { success: false, error: error.message || 'Failed to create column' }
  }
}

export async function updateColumn(id: string, formData: FormData) {
  try {
    const name = formData.get('name')?.toString()
    const type = formData.get('type')?.toString()
    const orderIndex = formData.get('orderIndex')?.toString()
    const settingsJsonStr = formData.get('settingsJson')?.toString()

    const updateData: any = {}
    if (name) updateData.name = name
    if (type) updateData.type = type
    if (orderIndex) updateData.orderIndex = parseInt(orderIndex)
    if (settingsJsonStr) {
      // SQLite stores JSON as string, validate it's valid JSON
      try {
        JSON.parse(settingsJsonStr)
        updateData.settingsJson = settingsJsonStr
      } catch {
        // Invalid JSON, skip
      }
    }

    const validated = updateColumnSchema.parse(updateData)

    const column = await prisma.column.update({
      where: { id },
      data: validated,
    })

    revalidatePath('/')
    return { success: true, data: column }
  } catch (error: any) {
    console.error('Error updating column:', error)
    return { success: false, error: error.message || 'Failed to update column' }
  }
}

export async function deleteColumn(id: string) {
  try {
    await prisma.column.delete({
      where: { id },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting column:', error)
    return { success: false, error: error.message || 'Failed to delete column' }
  }
}

export async function reorderColumns(columnIds: string[]) {
  try {
    await Promise.all(
      columnIds.map((id, index) =>
        prisma.column.update({
          where: { id },
          data: { orderIndex: index },
        })
      )
    )

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error reordering columns:', error)
    return { success: false, error: error.message || 'Failed to reorder columns' }
  }
}

