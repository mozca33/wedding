-- Check current policies on gifts table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'gifts';

-- Drop restrictive policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON gifts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON gifts;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON gifts;

-- Create permissive policies for gifts table
-- Allow anyone to read gifts (for public gift list)
CREATE POLICY "Anyone can view gifts"
  ON gifts FOR SELECT
  USING (true);

-- Allow service role to insert gifts
CREATE POLICY "Service role can insert gifts"
  ON gifts FOR INSERT
  WITH CHECK (true);

-- IMPORTANT: Allow service role to update gifts (for reservations and sales)
CREATE POLICY "Service role can update gifts"
  ON gifts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow service role to delete gifts
CREATE POLICY "Service role can delete gifts"
  ON gifts FOR DELETE
  USING (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'gifts';
