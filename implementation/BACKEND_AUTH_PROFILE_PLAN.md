# Phase 6B: Backend Auth & Profile Implementation Plan (Revised)

> **Revision:** 2026-08-27 — Security, data-model, auth-flow, and migration corrections applied per plan review.

---

## 1. Current Frontend State

The 1% Club currently relies entirely on static routes and mock data. Routes like `/login`, `/signup`, and `/onboarding` render the `AccessPage` component without performing any real backend requests. The UI statically reflects loading, empty, and success states. `src/services/mockApi.ts` provides mock data matching the TypeScript types in `src/types/index.ts`.

No authentication, profile storage, or membership logic exists yet.

---

## 2. Target Backend Architecture

- **Supabase Auth:** Secure email-based signup, login, email verification, password reset, and SSR session handling via HTTP-only cookies.
- **Supabase PostgreSQL:** Primary relational database.
- **TanStack Start Server Functions (`createServerFn`):** Type-safe server-side operations; the user ID is always derived from the authenticated server-side session, never from client-supplied input.
- **Zod:** Schema validation at every server function boundary.
- **RLS (Row Level Security):** Database-level authorization enforcing that users can only read and modify their own data.
- **Deployment:** Vercel (serverless/edge) with environment variables managed in the Vercel dashboard.

---

## 3. Exact Files That May Change

- `src/components/brand/access-pages.tsx` — Wire up real auth form handlers.
- `src/routes/login.tsx` and `src/routes/signup.tsx` — Add `beforeLoad` for session-aware redirects.
- `src/routes/__root.tsx` — Inject session/profile context for SSR.
- `src/services/mockApi.ts` — Retain for development fallback (dev-only flag required; must never run silently in production).
- New: `src/services/api.ts` — Real service layer wrapping server functions.
- New: `src/lib/supabase/browser.ts` — Browser-only Supabase client.
- New: `src/lib/supabase/server.ts` — Per-request server Supabase client (not shared across requests).
- New: `src/server/auth.ts` — Auth server functions.
- New: `src/server/profiles.ts` — Profile server functions.
- New: `src/server/memberships.ts` — Membership server functions.
- New: `supabase/migrations/` — Version-controlled SQL migration files.
- `package.json` — New dependencies.

---

## 4. Packages That May Be Required

- `@supabase/supabase-js` — Supabase JS client.
- `@supabase/ssr` — Cookie-based SSR auth adapter.
- `zod` — Already installed; used for server boundary validation.
- `@tanstack/react-start` — Already installed; server functions API.

---

## 5. Environment Variables Required

**Browser-safe variables (VITE_ prefix):**
- `VITE_SUPABASE_URL` — Public Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY` — The browser-safe publishable anon key for the Supabase project. Never a secret or service-role key.

**Future phases only (not Phase 6B):**
- `SUPABASE_SERVICE_ROLE_KEY` — Required for privileged server operations (e.g. webhooks, admin writes). This key must be:
  - Server-only — never prefixed with `VITE_`.
  - Never imported into browser code or client bundles.
  - Never committed to the repository.
  - Set only in the Vercel dashboard or a secure secrets manager.
  - Documented and approved in a separate plan before use.

---

## 6. Supabase Client and SSR Strategy

Use `@supabase/ssr` to separate browser and server Supabase clients:

- **Browser client** (`src/lib/supabase/browser.ts`): Created with `createBrowserClient(url, publishableKey)`. Safe for client components.
- **Server client** (`src/lib/supabase/server.ts`): Created with `createServerClient(url, publishableKey, { cookies })` **per request**. A new instance must be created for each TanStack Start server function invocation. No shared mutable client across requests.
- **Session derivation:** All server functions must call `supabase.auth.getUser()` to retrieve the authenticated user from the server-side cookie. They must never accept a `userId` parameter from the client.
- **Protected routes:** TanStack Start `beforeLoad` or a route loader calls `getSessionFn()` and redirects unauthenticated users to `/login`.

---

## 7. Proposed Tables and Fields

> Scope is strictly limited to `profiles`, `membership_plans`, and `memberships`. No other tables in Phase 6B.

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | References `auth.users.id`. Always identical to the auth UID. RLS uses `auth.uid() = id`. |
| `display_name` | Text | User-editable display name. |
| `handle` | Text UNIQUE | URL-safe identifier. |
| `avatar_path` | Text | Storage path, nullable. |
| `bio` | Text | Nullable. |
| `location` | Text | Nullable. |
| `timezone` | Text | Nullable. |
| `onboarding_completed_at` | Timestamptz | Set server-side when onboarding completes. |
| `created_at` | Timestamptz | Set on insert. |
| `updated_at` | Timestamptz | Updated by trigger. |

> **Removed fields vs. v1:** `name` (replaced by `display_name`), `initials` (derived on the frontend from `display_name`), `role` (must not be user-editable; roles are a future server-controlled concern tracked in Phase 6H).

### `membership_plans`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `name` | Text | "Explorer", "Member", "Inner Circle". |
| `tier` | Text | "free", "member", "inner-circle". |
| `price` | Numeric | Informational only in Phase 6B. |
| `created_at` | Timestamptz | |

### `memberships`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID | References `auth.users.id` directly. RLS uses `auth.uid() = user_id`. |
| `plan_id` | UUID | References `membership_plans.id`. |
| `status` | Text | "active", "trial", "cancelled", "past_due". **Read-only to the user.** |
| `start_date` | Timestamptz | |
| `end_date` | Timestamptz | Nullable. |
| `created_at` | Timestamptz | |

> **Note on default membership rows:** Phase 6B treats the _absence_ of an active membership record as Explorer access, resolved entirely in the `getCurrentEntitlementFn()` server function. No automatic default row insertion is performed. If a seeded default membership row is added in a later migration, it must document: seed order, trigger order, idempotency, failure handling, and RLS behavior before approval.

---

## 8. RLS Policies

### `profiles`
- **SELECT:** Users can read only their own profile (`auth.uid() = id`). No public read. No policy allowing all authenticated users to read all profiles. Community-visible profile data will be addressed later via a narrowly scoped view or dedicated server function.
- **UPDATE:** Users can update only their own profile (`auth.uid() = id`). The `role`, `id`, `created_at`, and `onboarding_completed_at` columns are excluded from user-editable fields at the application layer and guarded by column-level Zod schemas.
- **INSERT:** Handled exclusively by a `SECURITY DEFINER` trigger on `auth.users` insert — not by the user directly.
- **DELETE:** No user policy. Future admin-only operation.

### `membership_plans`
- **SELECT:** Public — anyone can read the plan catalogue.
- **INSERT/UPDATE/DELETE:** No user or anon policy. Service Role only, applied outside Phase 6B.

### `memberships`
- **SELECT:** Users can read only their own memberships (`auth.uid() = user_id`).
- **INSERT/UPDATE/DELETE:** No user policy. Status changes are exclusively server-controlled operations (verified webhook, admin workflow). Direct client writes are not permitted.

---

## 9. API/Service Methods

All server functions derive the current user from the server-side session. No `userId` parameters are accepted from the client.

**Auth (`src/server/auth.ts`):**
- `signUpFn({ email, password, displayName })` — Creates auth user; trigger creates profile. Returns session or check-email state.
- `signInWithEmailFn({ email, password })` — Returns session or error.
- `signOutFn()` — Clears session cookies.
- `getSessionFn()` — Returns current user from server-side cookie; never trusts client state.
- `requestPasswordResetFn({ email })` — Sends reset email.

**Profiles (`src/server/profiles.ts`):**
- `getCurrentProfileFn()` — Reads `profiles` for `auth.uid()`.
- `updateCurrentProfileFn({ displayName, handle, bio, location, timezone })` — Updates only safe fields for `auth.uid()`. Validated by Zod.
- `completeOnboardingFn({ displayName, handle })` — Sets `onboarding_completed_at` server-side for `auth.uid()`.

**Memberships (`src/server/memberships.ts`):**
- `getCurrentEntitlementFn()` — Returns the active membership for `auth.uid()`. If no active membership row exists, returns Explorer tier. Read-only; never mutates.

---

## 10. Auth Flow

1. User submits email and password on `/signup` or `/login`.
2. Frontend calls `signUpFn` or `signInWithEmailFn` via a TanStack Start server function.
3. Server creates a per-request `createServerClient`, authenticates with Supabase, and writes the session into HTTP-only cookies.
4. **Email confirmation branch:**
   - If Supabase returns a session immediately (email confirmation disabled in dev): redirect to `/onboarding` (new users) or `/dashboard` (returning users).
   - If Supabase requires email confirmation and returns no session: display a "Check your email" state. Do not redirect to `/dashboard`. Do not treat an unconfirmed user as authenticated.
5. On every protected route load, `getSessionFn()` is called server-side via `beforeLoad`. Unauthenticated users are redirected to `/login`.
6. Logout calls `signOutFn()`, which clears cookies and redirects to `/`.

---

## 11. Profile and Onboarding Flow

1. When a user signs up, a database trigger on `auth.users` (`AFTER INSERT`) calls a `SECURITY DEFINER` function that inserts a minimal `profiles` row (`id`, `display_name`, `created_at`).
2. The trigger must be idempotent and handle failure gracefully (log errors; do not block auth).
3. After email confirmation and login, the user is directed to `/onboarding`.
4. `/onboarding` calls `completeOnboardingFn()` with Zod-validated fields. The server sets `onboarding_completed_at`.
5. Profile updates use `updateCurrentProfileFn()`. Only safe, user-editable fields are accepted. Role, id, and timestamps are never user-writable.
6. `src/services/api.ts` maps the `profiles` database row to the `MemberProfile` TypeScript interface. Initials are derived on the frontend from `display_name`.

---

## 12. Membership-Status Flow

1. After session validation, `getCurrentEntitlementFn()` is called server-side.
2. It queries `memberships` for an active row where `user_id = auth.uid()`.
3. If an active row exists, return the linked `membership_plans.tier`.
4. If no active row exists, return Explorer tier without inserting any default row.
5. The resolved tier is injected into the root route context for the SSR render.
6. Frontend access guards (e.g., Trading Room entry) read tier exclusively from the server-provided context — never from client-side state or URL parameters.

---

## 13. Security Model

- **No secrets in the browser.** Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are in client bundles. Service-role keys are never prefixed with `VITE_`.
- **No trusted client IDs.** All current-user operations derive `auth.uid()` from the server-side cookie. No `userId` parameters from the browser.
- **No user-writable role field.** The `role` column is not in the `profiles` table for Phase 6B. Role-based access is a future concern (Phase 6H).
- **No user-writable membership status.** Membership reads are allowed; writes are blocked by RLS. Status changes require server-controlled operations.
- **Zod validation at every server boundary.** All server function inputs are parsed and rejected on schema failure before touching the database.
- **RLS as defense-in-depth.** Even if application-level logic is misconfigured, RLS prevents cross-user data access.
- **Mock fallback is dev-only.** The mock service must be gated behind an explicit `import.meta.env.DEV` or equivalent flag. It must never activate silently in production.
- **Secret scanning acceptance criteria:**
  - No secret key appears in frontend source files.
  - No secret key is prefixed with `VITE_`.
  - No secret key appears in the compiled client bundle (verified by `grep` on the build output).
  - No secret key is committed to Git (enforced by `.gitignore` and a pre-commit hook or CI secret scan).
  - No secret value is printed to logs.

---

## 14. Migration Strategy

- All schema changes are stored as numbered SQL files in `supabase/migrations/` and tracked in Git.
- Migrations are applied using the Supabase CLI (`supabase db push` or `supabase migration up`) against the target environment.
- **No manual SQL** is pasted into the Supabase dashboard without a corresponding migration file.
- Migration files in Phase 6B:
  - `20260827_001_create_profiles.sql`
  - `20260827_002_create_membership_plans.sql`
  - `20260827_003_create_memberships.sql`
  - `20260827_004_rls_policies.sql`
  - `20260827_005_profile_trigger.sql`

---

## 15. Testing Plan

**Functional tests:**
- Email signup → check-your-email state when confirmation required.
- Email signup → session returned → redirect to `/onboarding` when no confirmation required.
- Email login → session → redirect to `/dashboard`.
- Password reset email is sent.
- Session restoration on hard browser refresh.
- Logout clears session and redirects to `/`.
- Onboarding saves profile and sets `onboarding_completed_at`.
- `getCurrentEntitlementFn()` returns Explorer when no active membership exists.

**RLS tests (must test both allowed and denied):**
- Anonymous profile read → denied.
- Authenticated User A reading User B's profile → denied.
- Authenticated User A updating User B's profile → denied.
- User attempting to update membership status → denied.
- User reading only their own membership → allowed.
- Public reading active `membership_plans` → allowed.
- User reading their own profile → allowed.
- User updating their own safe profile fields → allowed.

**Secret scanning:**
- `grep` the Vite build output for service-role key substrings — must return empty.
- Confirm no `VITE_SUPABASE_SERVICE_ROLE_KEY` or equivalent in source files or `.env` files committed to Git.

---

## 16. Deployment Plan

1. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to Vercel dashboard (not committed to repo).
2. Run migrations against the Supabase production project using the Supabase CLI.
3. Deploy to Vercel preview environment and validate SSR session handling and cookie behavior.
4. Run full route verification on the preview URL before merging to production.

---

## 17. Rollback Plan

- `src/services/mockApi.ts` is retained and unchanged. In case of critical backend failure, a dev-only flag re-enables the mock service layer without code changes.
- Git revert the server function and route loader changes if SSR is broken.
- Migration rollback: each migration file must include a corresponding `down` block or a numbered rollback migration file.

---

## 18. Ordered Implementation Checklist

- [ ] 1. Await user approval of this revised plan.
- [ ] 2. Write SQL migration files in `supabase/migrations/` for all tables, triggers, and RLS policies.
- [ ] 3. Apply migrations to development Supabase project using the CLI.
- [ ] 4. Install `@supabase/supabase-js` and `@supabase/ssr`.
- [ ] 5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to Vercel dashboard and local `.env.local` (gitignored).
- [ ] 6. Create per-request server Supabase client (`src/lib/supabase/server.ts`).
- [ ] 7. Create browser Supabase client (`src/lib/supabase/browser.ts`).
- [ ] 8. Implement auth server functions (`src/server/auth.ts`) with email-confirmation branch.
- [ ] 9. Update `AccessPage` and `/login`, `/signup` routes with real auth and correct redirect logic.
- [ ] 10. Implement SSR session validation via `beforeLoad` for protected routes.
- [ ] 11. Implement profile server functions (`src/server/profiles.ts`).
- [ ] 12. Wire `/onboarding` to `completeOnboardingFn()`.
- [ ] 13. Implement `getCurrentEntitlementFn()` in `src/server/memberships.ts`.
- [ ] 14. Gate mock fallback behind an explicit `import.meta.env.DEV` check.
- [ ] 15. Run RLS acceptance tests (allowed and denied operations).
- [ ] 16. Run secret scanning on the build output.
- [ ] 17. Run `bun run format`, `bunx tsc --noEmit`, `bun run lint`, `bun run build`.
- [ ] 18. Verify full auth flow and all routes on Vercel preview.
- [ ] 19. Update `implementation/ISSUES.md` and close relevant issues.
