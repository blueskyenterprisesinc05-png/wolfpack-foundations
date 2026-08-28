-- Migration: 20260827_004_create_membership_plans.sql
-- Creates the membership_plans catalogue table.
-- Informational only in Phase 6B (no payment processing).
-- price_minor stores the plan price in minor currency units (e.g. cents / kobo) as an integer.
-- currency stores the ISO 4217 code (e.g. 'USD', 'NGN').
-- billing_interval: 'monthly', 'annual', or NULL for free plans.
-- is_active controls public catalogue visibility.
-- sort_order controls display ordering.

CREATE TABLE IF NOT EXISTS public.membership_plans (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  tier             TEXT NOT NULL,          -- 'free' | 'member' | 'inner-circle'
  description      TEXT,
  price_minor      INTEGER NOT NULL DEFAULT 0,  -- price in minor units (0 = free)
  currency         TEXT NOT NULL DEFAULT 'USD',
  billing_interval TEXT,                   -- 'monthly' | 'annual' | NULL
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT membership_plans_tier_check
    CHECK (tier IN ('free', 'member', 'inner-circle')),
  CONSTRAINT membership_plans_billing_interval_check
    CHECK (billing_interval IN ('monthly', 'annual') OR billing_interval IS NULL)
);

COMMENT ON TABLE public.membership_plans IS
  'Catalogue of The 1% Club membership plans. Informational only in Phase 6B. '
  'Payment processing is not implemented.';
COMMENT ON COLUMN public.membership_plans.tier IS
  'Canonical tier identifier: free | member | inner-circle.';
COMMENT ON COLUMN public.membership_plans.price_minor IS
  'Price in the smallest currency unit (e.g. cents for USD, kobo for NGN). 0 for free plans.';
COMMENT ON COLUMN public.membership_plans.is_active IS
  'Only active plans are shown in the public catalogue RLS policy.';

CREATE OR REPLACE TRIGGER membership_plans_set_updated_at
  BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
