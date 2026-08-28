-- Migration: 20260827_001_create_profiles.sql
-- Creates the public.profiles table.
-- id is the same UUID as auth.users.id so RLS can use auth.uid() = id directly.
-- No role column. No initials column. Initials are derived on the frontend.

CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name     TEXT,
  handle           TEXT UNIQUE,
  avatar_path      TEXT,
  bio              TEXT,
  location         TEXT,
  timezone         TEXT,
  onboarding_completed_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS
  'Extended user profile data for The 1% Club members. id mirrors auth.users.id.';
COMMENT ON COLUMN public.profiles.id IS
  'Primary key, identical to auth.users.id. Enables auth.uid() = id in RLS.';
COMMENT ON COLUMN public.profiles.display_name IS
  'User-chosen display name. Initials derived from this on the frontend.';
COMMENT ON COLUMN public.profiles.handle IS
  'Unique URL-safe identifier chosen during onboarding.';
COMMENT ON COLUMN public.profiles.avatar_path IS
  'Supabase Storage object path for the profile avatar, nullable.';
COMMENT ON COLUMN public.profiles.onboarding_completed_at IS
  'Timestamp set server-side when the user completes onboarding. Never client-supplied.';

-- updated_at trigger function (shared, created once)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
