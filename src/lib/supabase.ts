import { createClient } from '@supabase/supabase-js';

const NEW_SUPABASE_URL = "https://lyoiiwldzzvnykbrjfbh.supabase.co";
const NEW_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2lpd2xkenp2bnlrYnJqZmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzc2ODMsImV4cCI6MjA5MjYxMzY4M30.dKqwwz_8DDpT7QLDzmII0tSA67h6IKvUY7Qo9R3O6es";

export let supabase: any = null;

if (NEW_SUPABASE_URL && NEW_SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_ANON_KEY);
  } catch (e) {
    console.error('Supabase init error:', e);
  }
}

export const configureSupabase = (url: string, key: string) => {
  localStorage.setItem('SUPABASE_URL', url);
  localStorage.setItem('SUPABASE_KEY', key);
  window.location.reload();
};
