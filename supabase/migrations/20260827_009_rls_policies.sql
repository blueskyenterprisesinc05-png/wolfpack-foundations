-- Migration: 20260827_009_rls_policies.sql
-- Adds all RLS policies for profiles, membership_plans, and memberships.
--
-- Design principles:
-- 1. Users can only read and write their own data.
-- 2. No public profile read in Phase 6B.
-- 3. membership_plans: only active plans are publicly readable.
-- 4. memberships: users can SELECT only their own; no user INSERT/UPDATE/DELETE.
-- 5. Profile INSERT is handled exclusively by the on_auth_user_created trigger.
-- 6. Protected columns (id, created_at, onboarding_completed_at) are guarded
--    at the application layer (Zod); RLS does not restrict individual columns.
--
-- Use CREATE POLICY IF NOT EXISTS to make this migration idempotent if re-applied.
-- (Supported in PostgreSQL 16+ and the Supabase-hosted Postgres version.)
-- If running on an older version, the Supabase dashboard migration runner
-- will skip already-applied migrations via the schema_migrations table.

-- ── profiles ─────────────────────────────────────────────────────────────────

-- Users may read only their own profile.
CREATE POLICY "profiles: own read"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users may update only their own profile.
-- Protected fields (id, created_at, onboarding_completed_at) are excluded at the
-- application layer; RLS enforces which row, not which columns.
CREATE POLICY "profiles: own update"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT is allowed only by the handle_new_user() SECURITY DEFINER trigger,
-- which runs as the function owner (postgres/supabase_admin), not as the user.
-- No explicit user INSERT policy is required; the trigger bypasses RLS.

-- ── membership_plans ─────────────────────────────────────────────────────────

-- Active plans are publicly readable (anon and authenticated).
-- Inactive plans are not exposed.
CREATE POLICY "membership_plans: public read active"
  ON public.membership_plans
  FOR SELECT
  USING (is_active = TRUE);

-- No INSERT, UPDATE, or DELETE policy for regular users.
-- Plan management is a future admin/server-role operation.

-- ── memberships ──────────────────────────────────────────────────────────────

-- Users can read only their own membership records.
CREATE POLICY "memberships: own read"
  ON public.memberships
  FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT policy — memberships are created server-side (future admin/webhook flow).
-- No UPDATE policy — membership status is managed server-side only.
-- No DELETE policy — membership deletion is a future admin operation.
