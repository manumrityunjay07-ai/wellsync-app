-- ============================================================
-- WellSync Database Schema — Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE,
  age INT,
  gender TEXT,
  health_goals JSONB DEFAULT '{}',
  condition_profile JSONB DEFAULT '{"condition": "None"}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Mood Logs ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  stress_level INT CHECK (stress_level BETWEEN 1 AND 10),
  journal_note TEXT,
  ai_tone TEXT DEFAULT 'neutral',
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Workout Logs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  duration_mins INT,
  intensity TEXT CHECK (intensity IN ('low', 'medium', 'high')),
  muscle_groups TEXT[],
  energy_after INT CHECK (energy_after BETWEEN 1 AND 10),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Meal Logs ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_description TEXT NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  ai_calories INT,
  ai_protein_g FLOAT,
  ai_carbs_g FLOAT,
  ai_fats_g FLOAT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Sleep Logs ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bedtime TIMESTAMPTZ,
  wake_time TIMESTAMPTZ,
  duration_hrs FLOAT,
  quality_rating INT CHECK (quality_rating BETWEEN 1 AND 5),
  restedness_rating INT CHECK (restedness_rating BETWEEN 1 AND 5),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Vital Logs ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vital_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vital_type TEXT NOT NULL,
  value FLOAT NOT NULL,
  unit TEXT,
  ai_flag TEXT CHECK (ai_flag IN ('info', 'warning', 'urgent')),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Medications ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT DEFAULT 'daily',
  taken_today BOOLEAN DEFAULT FALSE,
  side_effect_note TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Habits ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  habit_name TEXT NOT NULL,
  target_per_week INT DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Habit Logs ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Well Scores ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS well_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INT CHECK (score BETWEEN 0 AND 100),
  pillar_breakdown JSONB DEFAULT '{}',
  ai_briefing TEXT,
  top_win TEXT,
  top_concern TEXT,
  cross_insight TEXT,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Friends ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- ─── Row Level Security (RLS) ─────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE well_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see/edit their own data
CREATE POLICY "Users: own data only" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Mood: own data" ON mood_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Workout: own data" ON workout_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Meal: own data" ON meal_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Sleep: own data" ON sleep_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Vitals: own data" ON vital_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Medications: own data" ON medications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Habits: own data" ON habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Habit logs: own data" ON habit_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "WellScores: own data" ON well_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Friends: own data" ON friends FOR ALL USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ─── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_mood_user_time ON mood_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_user_time ON workout_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_user_time ON meal_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_user_time ON sleep_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_vitals_user_time ON vital_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_wellscores_user_time ON well_scores(user_id, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user ON habit_logs(user_id, completed_at DESC);
