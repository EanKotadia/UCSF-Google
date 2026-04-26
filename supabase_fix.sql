-- Fix for UCSF 2026 Supabase Schema

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS schedule (
  id BIGSERIAL PRIMARY KEY,
  day_label TEXT,
  day_date DATE,
  time_start TIME,
  time_end TIME,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT,
  venue TEXT,
  house_ids TEXT, -- comma separated IDs
  status TEXT CHECK (status IN ('upcoming', 'live', 'completed')) DEFAULT 'upcoming',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video')) DEFAULT 'image',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staged_changes (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  updates JSONB NOT NULL,
  created_by UUID,
  created_by_email TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'discarded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add missing columns to houses if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'houses' AND COLUMN_NAME = 'sports_points') THEN
    ALTER TABLE houses ADD COLUMN sports_points INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'houses' AND COLUMN_NAME = 'cultural_points') THEN
    ALTER TABLE houses ADD COLUMN cultural_points INTEGER DEFAULT 0;
  END IF;
END $$;

-- 4. Enable RLS on all relevant tables
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staged_changes ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing permissive policies to avoid duplicates and create new ones
-- Note: This uses a broad approach as requested ("give all permissions for no error")
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Permissive access for %I" ON %I', t, t);
    EXECUTE format('CREATE POLICY "Permissive access for %I" ON %I FOR ALL USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;

-- 6. Grant usage to anon role (Supabase default)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;
