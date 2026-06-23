-- Add time_spent_seconds to workspace_members table
ALTER TABLE workspace_members ADD COLUMN IF NOT EXISTS time_spent_seconds INT DEFAULT 0;

-- Function to increment time spent atomically and return the new total
CREATE OR REPLACE FUNCTION increment_workspace_time_spent(
    p_workspace_id UUID,
    p_user_id UUID,
    p_seconds INT
) RETURNS INT AS $$
DECLARE
    new_total INT;
BEGIN
    UPDATE workspace_members
    SET time_spent_seconds = time_spent_seconds + p_seconds
    WHERE workspace_id = p_workspace_id AND user_id = p_user_id
    RETURNING time_spent_seconds INTO new_total;

    RETURN new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
