-- Migration: 20260829_011_learning_rls.sql
-- Implements RLS for Learning Data tables.

-- Enable RLS
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;

-- Public read access for the catalog and lessons. 
-- Note: The lesson content is gated server-side based on tier, 
-- but the rows themselves are readable to display the catalog.

CREATE POLICY "Allow public read access on instructors"
  ON public.instructors FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on courses"
  ON public.courses FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on course_objectives"
  ON public.course_objectives FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on lessons"
  ON public.lessons FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on lesson_resources"
  ON public.lesson_resources FOR SELECT
  USING (true);

-- No INSERT, UPDATE, or DELETE policies are created for public or authenticated roles.
-- These tables are strictly read-only from the client.
