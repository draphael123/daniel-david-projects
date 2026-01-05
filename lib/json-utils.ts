/**
 * Safe JSON parsing utilities
 * Prevents runtime errors from malformed JSON in database
 */

export function safeJsonParse<T = any>(json: string | null | undefined, defaultValue: T | null = null): T | null {
  if (!json || typeof json !== 'string') {
    return defaultValue
  }

  try {
    return JSON.parse(json) as T
  } catch (error) {
    console.error('Failed to parse JSON:', json, error)
    return defaultValue
  }
}

export function safeJsonStringify(value: any): string | null {
  if (value === null || value === undefined) {
    return null
  }

  try {
    return JSON.stringify(value)
  } catch (error) {
    console.error('Failed to stringify value:', value, error)
    return null
  }
}

