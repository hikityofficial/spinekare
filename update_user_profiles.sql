-- Add missing columns to user_profiles table for new onboarding questions
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS primary_reason TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS age_group TEXT,
ADD COLUMN IF NOT EXISTS occupation_type TEXT,
ADD COLUMN IF NOT EXISTS exercise_frequency TEXT,
ADD COLUMN IF NOT EXISTS pain_level TEXT,
ADD COLUMN IF NOT EXISTS posture_awareness TEXT,
ADD COLUMN IF NOT EXISTS sleep_position TEXT;
