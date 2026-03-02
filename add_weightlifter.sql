-- Final missing column for the user_profiles table 
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_weightlifter TEXT;
