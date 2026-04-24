import { createClient } from '@supabase/supabase-js';

const NEW_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const NEW_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export let supabase: any = null;

const storedUrl = localStorage.getItem('SUPABASE_URL');
const storedKey = localStorage.getItem('SUPABASE_KEY');

const finalUrl = NEW_SUPABASE_URL || storedUrl;
const finalKey = NEW_SUPABASE_ANON_KEY || storedKey;

if (finalUrl && finalKey) {
  try {
    supabase = createClient(finalUrl, finalKey);
  } catch (e) {
    console.error('Supabase init error:', e);
  }
}

export const configureSupabase = (url: string, key: string) => {
  localStorage.setItem('SUPABASE_URL', url);
  localStorage.setItem('SUPABASE_KEY', key);
  window.location.reload();
};
