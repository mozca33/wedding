// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

export const isValidAdmin = () => {
  try {
    const adminSession = localStorage.getItem('wedding_admin_session')
    if (!adminSession) return false
    
    const session = JSON.parse(adminSession)
    const now = new Date().getTime()
    const sessionTime = new Date(session.timestamp).getTime()
    const hoursDiff = (now - sessionTime) / (1000 * 60 * 60)
    
    return hoursDiff < 24
  } catch {
    return false
  }
}