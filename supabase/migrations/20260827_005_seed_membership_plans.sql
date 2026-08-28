-- Migration: 20260827_005_seed_membership_plans.sql
-- Seeds the canonical membership plans for The 1% Club.
-- Uses INSERT ... ON CONFLICT DO NOTHING so re-running the migration is safe.
-- UUIDs are deterministic (hardcoded) so downstream foreign keys remain stable.
-- Do not change these UUIDs after they are in production.
-- Price values are informational only — no payment processing in Phase 6B.

INSERT INTO public.membership_plans
  (id, name, tier, description, price_minor, currency, billing_interval, is_active, sort_order)
VALUES
  (
    '00000000-0001-4000-8000-000000000001',
    'Explorer',
    'free',
    'A taste of the discipline. Limited Mind Lab access, public community forum, and weekly newsletter.',
    0,
    'USD',
    NULL,
    TRUE,
    1
  ),
  (
    '00000000-0002-4000-8000-000000000002',
    'Member',
    'member',
    'The core 1% Club experience. Full Mind Lab curriculum, Trading Room access, Wolf Pack membership, and daily accountability tracking.',
    4900,
    'USD',
    'monthly',
    TRUE,
    2
  ),
  (
    '00000000-0003-4000-8000-000000000003',
    'Inner Circle',
    'inner-circle',
    'Direct guidance and exclusive access. Includes everything in Member plus live Wolf Sessions and direct Q&A with MindfulWolf.',
    19900,
    'USD',
    'monthly',
    TRUE,
    3
  )
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.membership_plans IS
  'Seeded by 20260827_005_seed_membership_plans.sql. '
  'Hardcoded UUIDs ensure stable foreign key references. '
  'Do not change UUIDs after first production deployment.';
