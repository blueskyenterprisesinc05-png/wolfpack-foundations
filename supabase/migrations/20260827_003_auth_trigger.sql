-- Migration: 20260827_003_auth_trigger.sql
-- Attaches handle_new_user() to the auth.users table.
-- CREATE OR REPLACE TRIGGER requires PostgreSQL 14+; Supabase supports this.
-- Fires AFTER INSERT so the auth.users row is fully committed before profile creation.
--
-- KNOWN ISSUE: The Supabase SQL Editor may silently skip this trigger registration
-- when pasting migrations manually. After running this file, always verify with:
--
--   SELECT trigger_name, event_object_schema, event_object_table
--   FROM information_schema.triggers
--   WHERE trigger_name = 'on_auth_user_created';
--
-- If the query returns no rows, re-run the CREATE OR REPLACE TRIGGER statement
-- directly in the SQL Editor until it returns one row.
-- This issue does not occur when applying migrations via the Supabase CLI.

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS
  'Fires public.handle_new_user() after each new auth.users insert '
  'to create a corresponding public.profiles row.';

