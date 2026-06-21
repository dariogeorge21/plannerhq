-- Create private channels between all existing workspace members across all workspaces
DO $$
DECLARE
  v_workspace RECORD;
  v_member1 RECORD;
  v_member2 RECORD;
BEGIN
  -- Loop through all workspaces
  FOR v_workspace IN SELECT id FROM public.workspaces LOOP
    -- For each workspace, loop through pairs of members to create unique combinations
    FOR v_member1 IN SELECT user_id FROM public.workspace_members WHERE workspace_id = v_workspace.id LOOP
      FOR v_member2 IN SELECT user_id FROM public.workspace_members WHERE workspace_id = v_workspace.id AND user_id > v_member1.user_id LOOP
        -- Create direct channel between member1 and member2
        -- The get_or_create_direct_channel function safely handles if the channel already exists
        PERFORM public.get_or_create_direct_channel(v_workspace.id, v_member1.user_id, v_member2.user_id);
      END LOOP;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
