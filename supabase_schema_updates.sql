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
