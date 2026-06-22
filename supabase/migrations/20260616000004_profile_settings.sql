ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": false, "push": false, "inApp": true}'::jsonb;

ALTER TABLE profiles ALTER COLUMN theme SET DEFAULT 'light';

-- Add role column to user profile
ALTER TABLE public.profiles
ADD COLUMN role VARCHAR(255);


