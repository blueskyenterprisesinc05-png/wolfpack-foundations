-- Migration: 20260829_010_create_learning_catalog.sql
-- Creates tables for Phase 7: Learning Data (Instructors, Courses, Lessons, Resources).

CREATE TABLE IF NOT EXISTS public.instructors (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  initials     TEXT NOT NULL,
  bio          TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.courses (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  subtitle         TEXT NOT NULL,
  category         TEXT NOT NULL,
  description      TEXT NOT NULL,
  level            TEXT NOT NULL,
  lesson_count     INTEGER NOT NULL DEFAULT 0,
  tier             TEXT NOT NULL,
  cover_label      TEXT NOT NULL,
  instructor_id    TEXT NOT NULL REFERENCES public.instructors(id),
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT courses_level_check CHECK (level IN ('foundation', 'intermediate', 'advanced')),
  CONSTRAINT courses_tier_check CHECK (tier IN ('free', 'member', 'inner-circle'))
);

CREATE TABLE IF NOT EXISTS public.course_objectives (
  id         TEXT PRIMARY KEY,
  course_id  TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id               TEXT PRIMARY KEY,
  course_id        TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  summary          TEXT,
  content          JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lesson_resources (
  id         TEXT PRIMARY KEY,
  lesson_id  TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  type       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT lesson_resources_type_check CHECK (type IN ('worksheet', 'guide', 'template'))
);

-- Triggers for updated_at
CREATE OR REPLACE TRIGGER instructors_set_updated_at
  BEFORE UPDATE ON public.instructors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER courses_set_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER lessons_set_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
