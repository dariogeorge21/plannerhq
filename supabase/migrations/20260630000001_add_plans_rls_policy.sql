-- Enable read access to plans table for all authenticated users
-- This is safe because plans are public information

CREATE POLICY "Enable read access for all users"
ON public.plans
FOR SELECT
USING (true);
