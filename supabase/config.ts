import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://ysallicdlgqajzjrjicr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzYWxsaWNkbGdxYWp6anJqaWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MzMxMjMsImV4cCI6MjA2OTEwOTEyM30.rv9ruHxVNTLLJaHxkcx6YOvG8ilO70XkhFtFoT-5z50'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})