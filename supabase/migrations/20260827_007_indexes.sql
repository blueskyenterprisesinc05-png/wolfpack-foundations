-- Migration: 20260827_007_indexes.sql
-- Adds performance indexes for the most common query patterns.

-- profiles: lookup by handle (unique constraint already adds an index, but made explicit)
CREATE INDEX IF NOT EXISTS profiles_handle_idx
  ON public.profiles (handle)
  WHERE handle IS NOT NULL;

-- memberships: primary access pattern is user_id + status for entitlement resolution
CREATE INDEX IF NOT EXISTS memberships_user_id_idx
  ON public.memberships (user_id);

CREATE INDEX IF NOT EXISTS memberships_user_id_status_idx
  ON public.memberships (user_id, status);

-- membership_plans: is_active filter used in the public catalogue query
CREATE INDEX IF NOT EXISTS membership_plans_is_active_sort_idx
  ON public.membership_plans (is_active, sort_order);
