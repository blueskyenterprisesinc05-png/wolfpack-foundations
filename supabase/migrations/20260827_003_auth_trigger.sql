-- Migration: 20260827_003_auth_trigger.sql
-- Attaches handle_new_user() to the auth.users table.
-- CREATE OR REPLACE TRIGGER requires PostgreSQL 14+; Supabase supports this.
-- Fires AFTER INSERT so the auth.users row is fully committed before profile creation.
--
-- !! SUPABASE PERMISSION CONSTRAINT !!
-- Running this file via the Supabase SQL Editor will fail with:
--   ERROR: 42501: must be owner of relation users
-- auth.users is owned by supabase_auth_admin, not postgres. The SQL Editor role
-- cannot create triggers on tables it does not own.
--
-- CORRECT PROCEDURE:
-- 1. Navigate to Supabase Dashboard → Database → Triggers → Create Trigger.
-- 2. Set: Table = auth.users, Event = INSERT, Timing = AFTER, Function = handle_new_user
-- OR
-- Navigate to the Database → SQL Editor and use the supabase_admin role if available.
--
-- KNOWN ISSUE: The Supabase SQL Editor may silently skip or fail this trigger registration
-- when pasting migrations manually. After running this file, always verify with:
--
--   SELECT trigger_name, event_object_schema, event_object_table
--   FROM information_schema.triggers
--   WHERE trigger_name = 'on_auth_user_created';
--
-- If the query returns no rows, use the Dashboard Triggers UI to create it manually.
-- This issue does not occur when applying migrations via the Supabase CLI with Docker.
-- For migration repair: mark this version as applied only after confirming the trigger
-- exists via the verification query above.


CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS
  'Fires public.handle_new_user() after each new auth.users insert '
  'to create a corresponding public.profiles row.';

