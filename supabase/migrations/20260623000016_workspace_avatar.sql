-- Add avatar_url to workspaces table
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS avatar_url TEXT;
