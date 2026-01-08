import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const SUPABASE_URL = 'https://orojpltfjcypnhjvjyjg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2pwbHRmamN5cG5oanZqeWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MDUzMDAsImV4cCI6MjA4MDA4MTMwMH0.NLj4ooLjEg_f7qAfWcXsiui54rCPtnxnN5XtY-mXiqU'

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: {
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, 
      flowType: 'pkce'
    },
  }
)


