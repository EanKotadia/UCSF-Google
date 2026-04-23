-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cleanup existing objects to ensure a clean state
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS notices CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS schedule CASCADE;
DROP TABLE IF EXISTS cultural_results CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS houses CASCADE;
DROP TABLE IF EXISTS committees CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS rankings CASCADE;
DROP TABLE IF EXISTS sponsors CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS staged_changes CASCADE;

-- Committees table
CREATE TABLE committees (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  bg_guide_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Members table (Team/OC/Secretariat)
CREATE TABLE members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  committee_id TEXT REFERENCES committees(id) ON DELETE SET NULL,
  category TEXT NOT NULL, -- 'Secretariat', 'OC', 'EB', 'Director', etc.
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rankings table
CREATE TABLE rankings (
  id BIGSERIAL PRIMARY KEY,
  committee_id TEXT REFERENCES committees(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Delegate Name
  school TEXT NOT NULL,
  award TEXT NOT NULL, -- e.g. Best Delegate, High Commendation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsors table
CREATE TABLE sponsors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  tier TEXT, -- 'Platinum', 'Gold', 'Silver', etc.
  website_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedule table
CREATE TABLE schedule (
  id BIGSERIAL PRIMARY KEY,
  day_label TEXT,
  day_date DATE,
  time_start TIME,
  time_end TIME,
  title TEXT NOT NULL,
  subtitle TEXT,
  venue TEXT,
  status TEXT CHECK (status IN ('upcoming', 'live', 'completed')) DEFAULT 'upcoming',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  key_name TEXT PRIMARY KEY,
  val TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video')) DEFAULT 'image',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notices table
CREATE TABLE notices (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table for role management
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  is_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staged changes table for approval workflow
CREATE TABLE staged_changes (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  updates JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by_email TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'discarded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staged_changes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for committees" ON committees FOR SELECT USING (true);
CREATE POLICY "Public read access for members" ON members FOR SELECT USING (true);
CREATE POLICY "Public read access for rankings" ON rankings FOR SELECT USING (true);
CREATE POLICY "Public read access for sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public read access for schedule" ON schedule FOR SELECT USING (true);
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Public read access for profiles" ON profiles FOR SELECT USING (true);

-- Create policies for admin write access
CREATE POLICY "Admin write access for committees" ON committees FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for members" ON members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for rankings" ON rankings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for sponsors" ON sponsors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for schedule" ON schedule FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for settings" ON settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for notices" ON notices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for staged_changes" ON staged_changes FOR ALL USING (auth.role() = 'authenticated');
