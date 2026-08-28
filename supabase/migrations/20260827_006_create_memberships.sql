-- Migration: 20260827_006_create_memberships.sql
-- Creates the memberships table linking auth.users to membership_plans.
-- user_id references auth.users.id directly (not profiles.id) for safe RLS.
-- Membership status is managed server-side only; no user writes permitted.
-- No default membership rows are inserted. Explorer access is resolved in
-- getCurrentEntitlementFn() when no active membership exists.

CREATE TABLE IF NOT EXISTS public.memberships (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  plan_id      UUID NOT NULL REFERENCES public.membership_plans (id),
  status       TEXT NOT NULL DEFAULT 'active',
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT memberships_status_check
    CHECK (status IN ('active', 'trial', 'cancelled', 'past_due'))
);

COMMENT ON TABLE public.memberships IS
  'Active and historical membership records for The 1% Club. '
  'Status is managed exclusively by server-controlled operations. '
  'No user can INSERT, UPDATE, or DELETE their own memberships.';
COMMENT ON COLUMN public.memberships.user_id IS
  'References auth.users.id directly. RLS policy: auth.uid() = user_id.';
COMMENT ON COLUMN public.memberships.status IS
  'active | trial | cancelled | past_due. Changed only by server-controlled workflows.';
COMMENT ON COLUMN public.memberships.expires_at IS
  'NULL means the membership has no set expiry (e.g. lifetime or open-ended).';

CREATE OR REPLACE TRIGGER memberships_set_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
