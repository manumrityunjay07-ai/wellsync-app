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
