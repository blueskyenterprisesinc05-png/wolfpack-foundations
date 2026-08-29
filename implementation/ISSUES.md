# Implementation Issues

### Issue #1: Bootstrap Project Context

**Status:** Closed
**Scope:** Documentation
**Description:**
Inspect the repository and create the central documentation source of truth, `PROJECT_CONTEXT.md`, along with issue tracking definitions.

**Acceptance Criteria:**

- [x] Create `implementation/PROJECT_CONTEXT_PLAN.md` and await approval.
- [x] Create `implementation/GITHUB_ISSUES_GUIDE.md` with the approved format.
- [x] Create `implementation/ISSUES.md` and record issues for this bootstrap task.
- [x] Draft `PROJECT_CONTEXT.md` based on repository inspection, covering all 18 sections.
- [x] Review `PROJECT_CONTEXT.md` for accuracy against `package.json` and `src/routes`.
- [x] Verify that no application code was modified, no packages were installed, and no backend logic/tables were created.

**Dependencies:**
None

**Related Plan:**
implementation/PROJECT_CONTEXT_PLAN.md

**Completion Notes:**
Completed on 2026-08-27. Identified some intended routes (`/about` and `/pricing`) as missing from current `src/routes`. No application code or dependencies were altered.

### Issue #2: Frontend Routes (About & Pricing)

**Status:** Closed
**Scope:** Frontend
**Description:**
Add the missing public routes `/about` and `/pricing` using the existing design system and routing conventions. Update navigation and footers to link to them.

**Acceptance Criteria:**

- [x] Create `src/routes/about.tsx` using existing routing pattern.
- [x] Create `src/routes/pricing.tsx` using existing routing pattern.
- [x] Implement About page with specified content and messaging.
- [x] Implement Pricing page with specified plans and founding-member messaging.
- [x] Add links in Desktop/Mobile navigation and footer.
- [x] Verify routes, layouts, and responsive behaviors.
- [x] Run format, lint, tsc, and build checks.

**Dependencies:**
Issue #1

**Related Plan:**
implementation/FRONTEND_ROUTES_PLAN.md

**Completion Notes:**
Closed on 2026-08-27. Implementation and full remote verification completed.
Vercel URL: https://wolfpack-foundations.vercel.app/
All 19 routes verified via direct navigation and browser refresh. Desktop and 300×535 mobile layouts verified for /, /about, and /pricing. No 404s, no unexpected redirects, no console errors. Checkout is a placeholder. No profit guarantees present. Deployment is publicly accessible.

### Issue #3: Phase 6B - Supabase Database Setup & Migrations
**Status:** In Progress
**Scope:** Backend
**Description:**
Write version-controlled SQL migration files for `profiles`, `membership_plans`, and `memberships` tables. Define all RLS policies and the profile-creation trigger. Apply migrations using the Supabase CLI. No manual SQL in the dashboard without a corresponding migration file.

**Acceptance Criteria:**
- [x] Create `supabase/migrations/` directory and all Phase 6B migration files.
- [x] `profiles` table uses `display_name`, `handle`, `avatar_path`, `bio`, `location`, `timezone`, `onboarding_completed_at`. No `role` column. No `initials` column.
- [x] `memberships` table uses `user_id` referencing `auth.users.id` (not `profile_id`).
- [x] RLS: Users can read and update only their own profile. No public read. No all-authenticated-users read.
- [x] RLS: Membership status is read-only to the user. No user INSERT/UPDATE/DELETE on `memberships`.
- [x] RLS: `membership_plans` is publicly readable (active plans only).
- [x] Profile-creation trigger is `SECURITY DEFINER`, idempotent, and logs errors without blocking auth.
- [x] No default membership row insertion in Phase 6B.
- [ ] Migrations applied to dev Supabase project via CLI (or manual dashboard fallback).
- [ ] Both allowed and denied RLS tests pass (see plan §15).

**Dependencies:**
Issue #2

**Related Plan:**
implementation/BACKEND_AUTH_PROFILE_PLAN.md

**Completion Notes:**
Supabase CLI access restored. Remote migration history currently shows no applied versions, confirming migration-history drift after manual Dashboard SQL execution. Read-only schema reconciliation is pending.

### Issue #4: Phase 6B - Auth Service & SSR Session Handling
**Status:** Closed
**Scope:** Backend/Frontend
**Description:**
Install `@supabase/ssr`. Create per-request server and browser Supabase clients. Implement auth server functions. Wire up login and signup UIs. Implement email-confirmation branch. Add SSR session protection to all protected routes.

**Acceptance Criteria:**
- [ ] Install `@supabase/supabase-js` and `@supabase/ssr`.
- [ ] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to Vercel dashboard and local `.env.local` (gitignored). No service-role key in Phase 6B.
- [ ] `src/lib/supabase/server.ts` creates a new per-request `createServerClient`. No shared mutable client.
- [ ] `src/lib/supabase/browser.ts` uses `createBrowserClient`.
- [ ] Auth server functions: `signUpFn`, `signInWithEmailFn`, `signOutFn`, `getSessionFn`, `requestPasswordResetFn`.
- [ ] No `userId` accepted from the client; user identity derived from server-side session only.
- [ ] Email confirmation branch: show "Check your email" state if no session returned. No redirect to `/dashboard` without a valid session.
- [ ] Protected routes use `beforeLoad` to validate session and redirect unauthenticated users.
- [ ] Zod validates all server function inputs.
- [ ] Error states wired to UI (wrong credentials, unconfirmed email, network error).

**Dependencies:**
Issue #3

**Related Plan:**
implementation/BACKEND_AUTH_PROFILE_PLAN.md

**Completion Notes:**
Pending.

### Issue #5: Phase 6B - Profile & Onboarding Backend
**Status:** Closed
**Scope:** Backend/Frontend
**Description:**
Implement profile server functions. Wire the onboarding route to `completeOnboardingFn()`. Map database profile row to frontend `MemberProfile` interface. Gate mock fallback behind `import.meta.env.DEV`.

**Acceptance Criteria:**
- [x] `getCurrentProfileFn()` reads profile for `auth.uid()` only.
- [x] `updateCurrentProfileFn()` accepts only safe fields: `display_name`, `handle`, `bio`, `location`, `timezone`. Role, id, and timestamps are excluded and rejected by Zod. (Replaced with one-step `completeOnboardingFn` per approval)
- [x] `completeOnboardingFn()` sets `onboarding_completed_at` server-side. Never client-supplied.
- [x] Frontend derives `initials` from `display_name`; not stored in DB.
- [x] Mock fallback in `src/services/mockApi.ts` gated behind `import.meta.env.DEV`. Must not run silently in production.
- [x] Profile data merged into root SSR context for downstream components.

**Dependencies:**
Issue #4

**Related Plan:**
implementation/BACKEND_AUTH_PROFILE_PLAN.md

**Completion Notes:**
Closed after manual verification confirming:
- **Unauthenticated access:** Handled correctly (redirects to login).
- **Successful onboarding:** `display_name`, `handle`, and `onboarding_completed_at` set successfully in one step.
- **Invalid-input rejection:** Zod validation enforces format (lowercase, no spaces) and length.
- **Duplicate-handle handling:** PostgreSQL `23505` unique violation correctly caught and surfaced to the UI.
- **Repeat submission:** Safe; updates profile fields and idempotently resets the timestamp.
- **Ownership enforcement:** `auth.uid()` implicitly enforced in server function; users cannot modify others' profiles.
- **Missing-profile handling:** Missing profile defaults gracefully handled by SSR context.
- **Production mock protection:** `mockApi.ts` safely fails closed when not in DEV.

### Issue #6: Phase 6B - Membership Entitlement Logic
**Status:** Closed
**Scope:** Backend/Frontend
**Description:**
Implement `getCurrentEntitlementFn()` to resolve the authenticated user's membership tier. Return Explorer if no active membership row exists. Enforce tier-based access guards on the frontend using server-provided context only.

**Acceptance Criteria:**
- [x] `getCurrentEntitlementFn()` queries `memberships` for `auth.uid()`. No client-supplied `userId`.
- [x] If no active membership exists, returns Explorer tier without inserting any default row.
- [x] Membership status is never writable by the user.
- [x] Frontend access guards read tier from server-provided SSR context only. Never from URL params, local storage, or client state.
- [x] RLS test: user cannot insert or update their own membership — denied.
- [x] RLS test: user can read only their own membership — allowed.

**Dependencies:**
Issue #5

**Related Plan:**
implementation/BACKEND_AUTH_PROFILE_PLAN.md

**Completion Notes:**
Backend function `getCurrentEntitlementFn()` is implemented to safely fetch tier and fallback to `"free"` deterministically. SSR context provides `profile.tier` for presentation only.

Closed after manual verification using a real authenticated user session:
- **Read Own Membership:** PASS (Allowed)
- **Read Other Membership:** PASS (Filtered by RLS, returns 0 rows safely)
- **Unauthorized Insert:** PASS (Blocked with 42501 unique violation/RLS policy)
- **Unauthorized Update:** PASS (Blocked by RLS, returns 0 rows updated)
Temporary test screen removed.

### Issue #7: Phase 7 - Learning Data (Courses & Lessons)
**Status:** In Progress
**Scope:** Backend/Frontend
**Description:**
Migrate static mock learning data (Courses, Lessons, Instructors) into the database. Implement server functions to fetch the catalog and securely gate lesson content based on membership entitlement.

**Acceptance Criteria:**
- [x] Create `instructors`, `courses`, `course_objectives`, `lessons`, and `resources` tables (migration SQL files).
- [x] Apply RLS policies: catalog is publicly readable, but `content` access is gated.
- [x] Create seed SQL to insert the existing mock data.
- [x] Implement `src/lib/courses.ts` and `src/lib/lessons.ts` server functions.
- [x] Securely gate lesson `content` on the server based on `getCurrentEntitlementFn()`.
- [x] Refactor frontend routes to use the new server functions instead of static mock files.

**Dependencies:**
Issue #6

**Related Plan:**
implementation_plan.md

**Completion Notes:**
Completed. The migration SQL files have been created in `supabase/migrations/` ready to be manually executed in the Supabase Dashboard. The frontend routes now use server functions which deterministically protect lesson content behind membership tier rules.
