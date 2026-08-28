-- Migration: 20260827_002_profile_trigger_function.sql
-- Creates the SECURITY DEFINER function that fires after a new auth.users row is inserted.
-- Sets a fixed search_path to prevent search-path injection.
-- Uses INSERT ... ON CONFLICT DO NOTHING for idempotency.
-- Does NOT create a membership row.
-- Does NOT accept or store user-controlled role or privileged fields.
-- Failures are logged via RAISE WARNING and do NOT block the auth.users insert.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    -- Prefer the display_name raw_user_meta_data field if provided by the signup call;
    -- fall back to the email local part as a safe temporary value.
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''),
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but allow the auth.users insert to succeed.
    RAISE WARNING
      'handle_new_user: failed to create profile for user %: % %',
      NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Creates a minimal public.profiles row after a new auth.users record is inserted. '
  'SECURITY DEFINER with fixed search_path. Idempotent. Does not create a membership row. '
  'Failures are logged and do not block signup.';
