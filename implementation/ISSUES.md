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
About and Pricing implementation and validation completed successfully. All commands and browser layout verifications passed.

### Issue #3: Phase 6B - Supabase Database Setup
**Status:** Open
**Scope:** Backend
**Description:**
Initialize the Supabase project schemas for `profiles`, `membership_plans`, and `memberships` tables. Define RLS policies and necessary triggers (e.g., auto-creating profiles on signup).

**Acceptance Criteria:**
- [ ] Create `profiles` table and RLS policies.
- [ ] Create `membership_plans` and `memberships` tables with admin-only RLS policies.
- [ ] Add trigger to create a profile automatically when a user signs up.

**Dependencies:**
Issue #2

**Related Plan:**
implementation/BACKEND_AUTH_PROFILE_PLAN.md

**Completion Notes:**
Pending.

### Issue #4: Phase 6B - Auth Service & SSR Session Handling
**Status:** Open
**Scope:** Backend/Frontend
**Description:**
Set up `@supabase/ssr` to securely manage authentication and session cookies via TanStack Start server functions. Wire up the login and signup UIs to the real backend.

**Acceptance Criteria:**
- [ ] Install `@supabase/supabase-js` and `@supabase/ssr`.
- [ ] Create server and browser Supabase clients.
- [ ] Implement `signIn`, `signUp`, and `signOut` server functions.
- [ ] Secure protected routes using an SSR route loader.
- [ ] Handle Zod validation and error states on auth forms.

**Dependencies:**
Issue #3

**Related Plan:**
implementation/BACKEND_AUTH_PROFILE_PLAN.md

**Completion Notes:**
Pending.

### Issue #5: Phase 6B - Profile & Onboarding Backend
**Status:** Open
**Scope:** Backend/Frontend
**Description:**
Connect the onboarding flow to the Supabase backend to allow users to update their profiles securely. Transition away from mock data for profiles.

**Acceptance Criteria:**
- [ ] Implement `getProfile` and `updateProfile` server functions.
- [ ] Connect the frontend onboarding steps to `updateProfile` with Zod validation.
- [ ] Merge the real profile data into the main SSR layout context.

**Dependencies:**
Issue #4

**Related Plan:**
implementation/BACKEND_AUTH_PROFILE_PLAN.md

**Completion Notes:**
Pending.

### Issue #6: Phase 6B - Membership Status Logic
**Status:** Open
**Scope:** Backend/Frontend
**Description:**
Retrieve the user's active membership plan from the backend and enforce basic access control for premium paths (e.g., Trading Room) without implementing payments yet.

**Acceptance Criteria:**
- [ ] Implement `getCurrentMembership` server function.
- [ ] Create mock data fallback or assign default "Explorer" status.
- [ ] Restrict access to premium components based on server-verified tier.

**Dependencies:**
Issue #5

**Related Plan:**
implementation/BACKEND_AUTH_PROFILE_PLAN.md

**Completion Notes:**
Pending.
