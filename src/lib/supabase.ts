import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qkjwwyduzxewydvvmrbv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrand3eWR1enhld3lkdnZtcmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDE5NjEsImV4cCI6MjA5MDY3Nzk2MX0.ITmzj8YP9Ywqnsk1gSe02WlA7De3l1u2JbGYAVPyX5w';

// Only initialize if we have the required credentials
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn('Supabase credentials missing.');
}
