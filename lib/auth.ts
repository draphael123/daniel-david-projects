import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function getAllowedEmails(): string[] {
  const emails = process.env.ALLOWED_EMAILS || ''
  return emails.split(',').map(e => e.trim()).filter(Boolean)
}

export function getSharedPasscode(): string | null {
  return process.env.SHARED_PASSCODE || null
}

export async function checkAuth(email?: string, passcode?: string): Promise<boolean> {
  // If using Supabase auth, check email
  if (email) {
    const allowedEmails = getAllowedEmails()
    if (allowedEmails.length > 0) {
      return allowedEmails.includes(email.toLowerCase())
    }
  }

  // Fallback to passcode if no email allowlist or Supabase not configured
  const sharedPasscode = getSharedPasscode()
  if (sharedPasscode && passcode) {
    return passcode === sharedPasscode
  }

  // If neither auth method is configured, allow access (for development)
  if (!supabase && !sharedPasscode && getAllowedEmails().length === 0) {
    console.warn('⚠️ No auth configured. Allowing access.')
    return true
  }

  return false
}

