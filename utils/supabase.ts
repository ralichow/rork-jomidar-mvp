// supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Use your real values from Supabase → Project Settings → API
const supabaseUrl = 'https://rctwuwoyhqjnexnnapnz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjdHd1d295aHFqbmV4bm5hcG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTExMDksImV4cCI6MjA3MjA4NzEwOX0.unW5OqKVkkWMuIzneuiusNr2K29-nq1OadH2-UIBAVc';


// Create client with AsyncStorage support for React Native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});