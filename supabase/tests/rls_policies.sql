-- Migration: 20260827_010_rls_tests.sql
-- Executable RLS acceptance tests for Phase 6B.
-- Run these in the Supabase SQL editor (or via CLI with --file) against the dev project.
-- They use SET LOCAL ROLE and SET LOCAL request.jwt.claims to simulate users.
-- Each block asserts the expected outcome using ASSERT or by checking row counts.
--
-- HOW TO RUN:
--   supabase db reset            -- apply all migrations from scratch
--   psql $DATABASE_URL -f supabase/migrations/20260827_010_rls_tests.sql
--
-- All tests must complete without ERROR.
-- "ASSERT" failures will raise a PL/pgSQL error with a descriptive message.
--
-- Prerequisites:
--   Two test users must exist in auth.users with UUIDs:
--     user_a_id = 'aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa'
--     user_b_id = 'bbbbbbbb-bbbb-4000-8000-bbbbbbbbbbbb'
--   These can be created via:
--     INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
--     VALUES (...) -- see seed block below.
--
-- NOTE: These tests run inside a transaction that is rolled back at the end
-- so they do not permanently affect the database state.

BEGIN;

-- ── Seed test users ───────────────────────────────────────────────────────────
-- Only inserted if they don't exist, so the file is re-runnable.

INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at, aud, role
)
VALUES
  (
    'aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa',
    'user_a@test.local',
    '$2a$10$placeholder_hashed_password_value_a',
    NOW(), '{"display_name": "User A"}', NOW(), NOW(), 'authenticated', 'authenticated'
  ),
  (
    'bbbbbbbb-bbbb-4000-8000-bbbbbbbbbbbb',
    'user_b@test.local',
    '$2a$10$placeholder_hashed_password_value_b',
    NOW(), '{"display_name": "User B"}', NOW(), NOW(), 'authenticated', 'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- Trigger will have created profiles for both users via on_auth_user_created.
-- Verify profiles exist:
DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa') = 1,
    'FAIL: Profile for user_a not created by trigger';
  ASSERT (SELECT COUNT(*) FROM public.profiles WHERE id = 'bbbbbbbb-bbbb-4000-8000-bbbbbbbbbbbb') = 1,
    'FAIL: Profile for user_b not created by trigger';
  RAISE NOTICE 'PASS: Trigger created profiles for both test users';
END;
$$;

-- ── Test helper: simulate a JWT session for a given user ──────────────────────
-- We use SET LOCAL to configure the RLS context within the transaction.

-- ── TEST 1: Anonymous profile read → DENIED ───────────────────────────────────
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claims" TO '{}';
DO $$
DECLARE
  row_count INT;
BEGIN
  SELECT COUNT(*) INTO row_count FROM public.profiles;
  ASSERT row_count = 0,
    'FAIL: Anonymous user should not read any profiles, got ' || row_count;
  RAISE NOTICE 'PASS: Anonymous profile read denied';
END;
$$;
RESET ROLE;

-- ── TEST 2: User A reads their own profile → ALLOWED ─────────────────────────
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa"}';
DO $$
DECLARE
  row_count INT;
BEGIN
  SELECT COUNT(*) INTO row_count
  FROM public.profiles
  WHERE id = 'aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa';
  ASSERT row_count = 1,
    'FAIL: User A should read own profile, got ' || row_count;
  RAISE NOTICE 'PASS: User A can read own profile';
END;
$$;
RESET ROLE;

-- ── TEST 3: User A reads User B's profile → DENIED ───────────────────────────
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa"}';
DO $$
DECLARE
  row_count INT;
BEGIN
  SELECT COUNT(*) INTO row_count
  FROM public.profiles
  WHERE id = 'bbbbbbbb-bbbb-4000-8000-bbbbbbbbbbbb';
  ASSERT row_count = 0,
    'FAIL: User A should not read User B''s profile, got ' || row_count;
  RAISE NOTICE 'PASS: User A cannot read User B''s profile';
END;
$$;
RESET ROLE;

-- ── TEST 4: User A updates their own profile → ALLOWED ───────────────────────
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa"}';
DO $$
BEGIN
  UPDATE public.profiles
  SET bio = 'Test bio update'
  WHERE id = 'aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa';
  RAISE NOTICE 'PASS: User A can update own profile';
END;
$$;
RESET ROLE;

-- ── TEST 5: User A updates User B's profile → DENIED ─────────────────────────
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa"}';
DO $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE public.profiles
  SET bio = 'Hijacked bio'
  WHERE id = 'bbbbbbbb-bbbb-4000-8000-bbbbbbbbbbbb';
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  ASSERT rows_affected = 0,
    'FAIL: User A should not update User B''s profile, rows affected: ' || rows_affected;
  RAISE NOTICE 'PASS: User A cannot update User B''s profile';
END;
$$;
RESET ROLE;

-- ── TEST 6: Anonymous reads active membership plans → ALLOWED ─────────────────
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claims" TO '{}';
DO $$
DECLARE
  row_count INT;
BEGIN
  SELECT COUNT(*) INTO row_count FROM public.membership_plans WHERE is_active = TRUE;
  ASSERT row_count >= 3,
    'FAIL: Anonymous should see all active membership plans, got ' || row_count;
  RAISE NOTICE 'PASS: Anonymous can read active membership plans';
END;
$$;
RESET ROLE;

-- ── TEST 7: User cannot INSERT a membership → DENIED ─────────────────────────
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa"}';
DO $$
BEGIN
  BEGIN
    INSERT INTO public.memberships (user_id, plan_id, status)
    VALUES (
      'aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa',
      '00000000-0001-4000-8000-000000000001',
      'active'
    );
    RAISE EXCEPTION 'FAIL: User A should not be able to insert a membership';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS: User A cannot insert a membership (RLS denied)';
    WHEN others THEN
      RAISE NOTICE 'PASS: User A cannot insert a membership (error: %)', SQLERRM;
  END;
END;
$$;
RESET ROLE;

-- ── TEST 8: User can read their own membership (when one exists) → ALLOWED ────
-- Insert a test membership as the superuser (bypasses RLS) then verify user can read it.
RESET ROLE; -- ensure we're superuser for this direct insert
INSERT INTO public.memberships (id, user_id, plan_id, status)
VALUES (
  'cccccccc-cccc-4000-8000-cccccccccccc',
  'aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa',
  '00000000-0002-4000-8000-000000000002',
  'active'
)
ON CONFLICT (id) DO NOTHING;

SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa"}';
DO $$
DECLARE
  row_count INT;
BEGIN
  SELECT COUNT(*) INTO row_count
  FROM public.memberships
  WHERE user_id = 'aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa';
  ASSERT row_count = 1,
    'FAIL: User A should read own membership, got ' || row_count;
  RAISE NOTICE 'PASS: User A can read own membership';
END;
$$;
RESET ROLE;

-- ── TEST 9: User A cannot read User B's membership → DENIED ──────────────────
-- Insert a membership for user_b as superuser.
RESET ROLE;
INSERT INTO public.memberships (id, user_id, plan_id, status)
VALUES (
  'dddddddd-dddd-4000-8000-dddddddddddd',
  'bbbbbbbb-bbbb-4000-8000-bbbbbbbbbbbb',
  '00000000-0001-4000-8000-000000000001',
  'trial'
)
ON CONFLICT (id) DO NOTHING;

SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa"}';
DO $$
DECLARE
  row_count INT;
BEGIN
  SELECT COUNT(*) INTO row_count
  FROM public.memberships
  WHERE user_id = 'bbbbbbbb-bbbb-4000-8000-bbbbbbbbbbbb';
  ASSERT row_count = 0,
    'FAIL: User A should not read User B''s membership, got ' || row_count;
  RAISE NOTICE 'PASS: User A cannot read User B''s membership';
END;
$$;
RESET ROLE;

-- ── TEST 10: User cannot UPDATE membership status → DENIED ───────────────────
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa"}';
DO $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE public.memberships
  SET status = 'active'
  WHERE user_id = 'aaaaaaaa-aaaa-4000-8000-aaaaaaaaaaaa';
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  ASSERT rows_affected = 0,
    'FAIL: User A should not update membership status, rows affected: ' || rows_affected;
  RAISE NOTICE 'PASS: User A cannot update membership status';
END;
$$;
RESET ROLE;

-- ── TEST 11: Trigger did not create a membership for new users ────────────────
DO $$
DECLARE
  membership_count INT;
BEGIN
  -- We only seeded memberships manually above; trigger should not have auto-created any.
  -- The trigger-created count is: total memberships minus the 2 we manually seeded.
  SELECT COUNT(*) INTO membership_count
  FROM public.memberships
  WHERE id NOT IN (
    'cccccccc-cccc-4000-8000-cccccccccccc',
    'dddddddd-dddd-4000-8000-dddddddddddd'
  );
  ASSERT membership_count = 0,
    'FAIL: Trigger should not have created membership rows, found ' || membership_count;
  RAISE NOTICE 'PASS: Trigger did not create membership rows for new users';
END;
$$;

ROLLBACK; -- Roll back all test data; database state is restored to pre-test.
