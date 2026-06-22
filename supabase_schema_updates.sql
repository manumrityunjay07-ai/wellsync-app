-- Monetization Schema Updates

-- Add columns to users table for plan tracking
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS ai_calls_today INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_calls_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create an index to make lookups faster
CREATE INDEX IF NOT EXISTS idx_users_plan ON public.users(plan);
CREATE INDEX IF NOT EXISTS idx_users_ai_reset ON public.users(ai_calls_reset_at);

-- Set default value for existing users
UPDATE public.users SET plan = 'free', ai_calls_today = 0, ai_calls_reset_at = NOW() WHERE plan IS NULL;

-- Add role column for Archimedes Pivot
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'patient';
UPDATE public.users SET role = 'patient' WHERE role IS NULL;

-- 4. Create Archimedes Alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    type text NOT NULL,
    category text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Enable RLS and create policy for read-only access (or all access for demo)
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow insert access to authenticated users" ON public.alerts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Phase 5: Search History Table
CREATE TABLE IF NOT EXISTS search_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    type TEXT NOT NULL,
    is_saved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 5: Onboarding Tour
ALTER TABLE users ADD COLUMN IF NOT EXISTS has_completed_tour BOOLEAN DEFAULT false;

-- Phase 5: Shared Reports
CREATE TABLE IF NOT EXISTS shared_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    result_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
