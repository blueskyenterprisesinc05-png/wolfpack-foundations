-- Migration: 20260827_008_enable_rls.sql
-- Enables Row Level Security on all three Phase 6B tables.
-- RLS must be enabled before any policies are added.
-- Once enabled, all access is denied by default until an explicit policy permits it.

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships     ENABLE ROW LEVEL SECURITY;
