-- Harmonia MUN 2026 - Database Fix Script
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/lyoiiwldzzvnykbrjfbh/sql/new)

-- 1. Create missing tables
CREATE TABLE IF NOT EXISTS public.schedule (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    day_label TEXT,
    day_date DATE,
    time_start TIME,
    time_end TIME,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT,
    venue TEXT,
    house_ids TEXT,
    status TEXT DEFAULT 'upcoming',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT,
    type TEXT DEFAULT 'image',
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.settings (
    key_name TEXT PRIMARY KEY,
    val TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.staged_changes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    table_name TEXT,
    record_id TEXT,
    updates JSONB,
    created_by UUID,
    created_by_email TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notices (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    content TEXT,
    priority TEXT DEFAULT 'normal',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure columns exist in houses
ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS sports_points INTEGER DEFAULT 0;
ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS cultural_points INTEGER DEFAULT 0;

-- 3. Fix Permissions (Enable RLS and allow all access for Admin Panel)
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('houses', 'matches', 'categories', 'notices', 'cultural_results', 'schedule', 'gallery', 'settings', 'staged_changes')
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "Public Access" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Public Access" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t);
    END LOOP;
END $$;

-- 4. Initial Settings
INSERT INTO public.settings (key_name, val) VALUES
('festival_name', 'Harmonia MUN 2026'),
('festival_subtitle', 'Celebrating diplomatic excellence and exceptional contribution to the conference.'),
('announcement_text', 'CONFERENCE AWARDS WILL BE ANNOUNCED FOLLOWING THE CLOSING CEREMONY.')
ON CONFLICT (key_name) DO UPDATE SET val = EXCLUDED.val;
