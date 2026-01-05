import { z } from 'zod'

export const columnTypeSchema = z.enum([
  'text',
  'number',
  'select',
  'multi_select',
  'date',
  'checkbox',
  'url',
])

export const columnSettingsSchema = z.object({
  options: z
    .array(
      z.object({
        label: z.string(),
        color: z.string(),
      })
    )
    .optional(),
})

export const createColumnSchema = z.object({
  name: z.string().min(1).max(100),
  type: columnTypeSchema,
  orderIndex: z.number().int(),
  settingsJson: z.any().optional(),
})

export const updateColumnSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: columnTypeSchema.optional(),
  orderIndex: z.number().int().optional(),
  settingsJson: z.any().optional(),
})

export const createRowSchema = z.object({
  orderIndex: z.number().int(),
})

export const updateCellSchema = z.object({
  rowId: z.string(),
  columnId: z.string(),
  valueJson: z.any(),
})

// Type-specific value validation
export function validateCellValue(type: string, value: any): boolean {
  switch (type) {
    case 'text':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && !isNaN(value)
    case 'checkbox':
      return typeof value === 'boolean'
    case 'date':
      return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    case 'url':
      if (typeof value !== 'string' || !value) return true // Allow empty
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    case 'select':
      return typeof value === 'string'
    case 'multi_select':
      return Array.isArray(value) && value.every(v => typeof v === 'string')
    default:
      return true
  }
}

export function parseCellValue(type: string, rawValue: string): any {
  if (!rawValue || rawValue.trim() === '') {
    if (type === 'checkbox') return false
    if (type === 'number') return null
    if (type === 'multi_select') return []
    return null
  }

  switch (type) {
    case 'text':
    case 'select':
    case 'url':
      return rawValue
    case 'number':
      const num = parseFloat(rawValue)
      return isNaN(num) ? null : num
    case 'checkbox':
      return rawValue === 'true' || rawValue === '1' || rawValue === 'yes'
    case 'date':
      return rawValue
    case 'multi_select':
      try {
        const parsed = JSON.parse(rawValue)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    default:
      return rawValue
  }
}

