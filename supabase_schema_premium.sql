-- Add subscription tier column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
