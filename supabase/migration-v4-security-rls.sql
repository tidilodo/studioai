-- OráculoAI v4 — Security Fix: Enable RLS on all tables
-- This migration fixes the security vulnerability where astro_events was publicly accessible

-- Enable RLS on astro_events
ALTER TABLE astro_events ENABLE ROW LEVEL SECURITY;

-- Since astro_events is a public reference table (not user-specific),
-- we create a policy that allows anyone to read but only admins to write
CREATE POLICY "Anyone can read astro events" ON astro_events FOR SELECT USING (true);
CREATE POLICY "Service role can manage astro events" ON astro_events FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update astro events" ON astro_events FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete astro events" ON astro_events FOR DELETE USING (auth.role() = 'service_role');

-- Verify all tables have RLS enabled
SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✓ RLS Enabled' ELSE '✗ RLS Disabled' END as security_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN ('_realtime', 'tenants', 'tenant_members')
ORDER BY tablename;
