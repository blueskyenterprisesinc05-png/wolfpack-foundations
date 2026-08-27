# Phase 6B: Backend Auth & Profile Implementation Plan

## 1. Current Frontend State
The 1% Club currently relies entirely on static routes and mock data. Routes like `/login`, `/signup`, and `/onboarding` render the `AccessPage` component without performing any actual backend requests. The UI accurately reflects loading, empty, and success states statically, while `src/services/mockApi.ts` currently provides mock `MemberProfile` and other data according to the TypeScript types in `src/types/index.ts`.

## 2. Target Backend Architecture
The backend will be implemented using:
- **Supabase Auth:** For secure email-based signup, login, password reset, and SSR session handling.
- **Supabase PostgreSQL:** As the primary database.
- **TanStack Start Server Functions (`createServerFn`):** For type-safe server-side operations using the `@tanstack/react-start` API.
- **Zod:** For request and payload validation at the server boundary.
- **RLS (Row Level Security):** To enforce authorization at the database level, ensuring users can only read/modify their own profiles and memberships.
- **Deployment:** Vercel edge/serverless infrastructure.

## 3. Exact Files That May Change
- `src/components/brand/access-pages.tsx` (Wire up form handlers for login/signup).
- `src/routes/login.tsx` & `src/routes/signup.tsx` (Add route loaders or context for SSR auth check).
- `src/routes/__root.tsx` (Add context for user session and profile).
- `src/services/mockApi.ts` -> `src/services/api.ts` (Migrate from mock to real server functions, maintaining a fallback mechanism).
- New files: `src/lib/supabase/client.ts` & `src/lib/supabase/server.ts` (Supabase initialization).
- New files: `src/server/auth.ts`, `src/server/profiles.ts`, `src/server/memberships.ts` (TanStack server functions).
- `package.json` (New dependencies).

## 4. Packages That May Be Required
- `@supabase/supabase-js` (Supabase client).
- `@supabase/ssr` (For cookie-based SSR auth).
- `zod` (Already installed, for schema validation).
- `@tanstack/react-start` (Already installed, utilizing server functions).

## 5. Environment Variables Required
- `VITE_SUPABASE_URL`: Public Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Public Supabase Anon Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Private Supabase Service Role Key (for webhook or elevated backend operations, if needed).

## 6. Supabase Client and SSR Strategy
We will use `@supabase/ssr` to securely handle auth state between the TanStack Start server and client.
- **Client Client:** `createBrowserClient` to be used in client components for realtime/client-only calls.
- **Server Client:** `createServerClient` inside TanStack Start server functions and route loaders to read/write cookies securely.
- **Middleware/Loaders:** Protect authenticated routes (like `/dashboard`) by checking the Supabase session in the `beforeLoad` or SSR load process.

## 7. Proposed Tables and Fields
Scope limited strictly to the following tables:

**`profiles`**
- `id` (UUID, primary key, references `auth.users`)
- `handle` (Text, unique)
- `name` (Text)
- `initials` (Text)
- `role` (Text, default 'member')
- `bio` (Text, nullable)
- `location` (Text, nullable)
- `created_at` (Timestamptz)
- `updated_at` (Timestamptz)

**`membership_plans`**
- `id` (UUID, primary key)
- `name` (Text) // "Explorer", "Member", "Inner Circle"
- `tier` (Text) // "free", "member", "inner-circle"
- `price` (Numeric)
- `created_at` (Timestamptz)

**`memberships`**
- `id` (UUID, primary key)
- `profile_id` (UUID, references `profiles`)
- `plan_id` (UUID, references `membership_plans`)
- `status` (Text) // "active", "trial", "cancelled", "past_due"
- `start_date` (Timestamptz)
- `end_date` (Timestamptz, nullable)
- `created_at` (Timestamptz)

## 8. RLS Policies
**`profiles`**
- SELECT: Public can read basic profile info for community features, or Authenticated users can read all profiles.
- UPDATE: Users can only update their own profile (`auth.uid() = id`).
- INSERT: Handled by Supabase Auth triggers or specific server function.

**`membership_plans`**
- SELECT: Public (anyone can see available plans).
- INSERT/UPDATE/DELETE: Only admin roles (or Service Role).

**`memberships`**
- SELECT: Users can only read their own memberships (`auth.uid() = profile_id`).
- INSERT/UPDATE/DELETE: Service Role only (handled securely on the backend after checkout/admin action).

## 9. API/Service Methods
TanStack Start Server Functions (`createServerFn`):
- `signInWithEmailFn({ email, password })`
- `signUpFn({ email, password, name })`
- `signOutFn()`
- `getSessionFn()`
- `getProfileFn({ userId })`
- `updateProfileFn({ bio, handle, location, etc })`
- `getCurrentMembershipFn()`

## 10. Auth Flow
1. User enters email/password in `/signup` or `/login`.
2. Frontend calls `signUpFn` / `signInWithEmailFn` (server functions).
3. Server uses `@supabase/ssr` to authenticate and securely set HTTP-only cookies.
4. Success redirects to `/dashboard` or `/onboarding`.
5. SSR route loaders check `getSessionFn()` before rendering protected pages.
6. Logout calls `signOutFn()`, clearing cookies.

## 11. Profile and Onboarding Flow
1. Upon signup, a `profile` row is created via a database trigger on `auth.users` insert (or directly via a secured server function).
2. During `/onboarding`, the user updates their profile using `updateProfileFn` with Zod validation.
3. The frontend `src/services/api.ts` maps the database profile into the `MemberProfile` TypeScript interface.

## 12. Membership-Status Flow
1. New users are assigned a "Free" / "Explorer" tier by default if no active membership exists.
2. The `getCurrentMembershipFn()` checks the `memberships` table for the user's active plan.
3. The server merges the membership status into the user's session/profile response.
4. Protected actions on the frontend (like entering the Trading Room) verify the `tier` returned from the server.

## 13. Security Model
- No database credentials exposed in the browser.
- Zod schemas enforce type strictness on all incoming server function data.
- Row Level Security ensures accidental client misconfigurations cannot expose private data.
- Membership status is solely determined by server-side DB checks, completely ignoring client-side state manipulation.

## 14. Testing Plan
- Create test Supabase project (local or cloud dev).
- Run database migrations for the 3 tables and RLS policies.
- Verify email signup/login flow works end-to-end.
- Verify session restoration on hard refresh.
- Verify onboarding saves profile data.
- Verify mock-data fallback logic still works when auth is bypassed during local development if needed.

## 15. Deployment Plan
- Add Vercel Environment Variables (`VITE_SUPABASE_URL`, etc.).
- Ensure Vercel build correctly utilizes the `@tanstack/react-start` adapter.
- Test production SSR rendering and cookie handling on Vercel preview environments.

## 16. Rollback Plan
- Keep `src/services/mockApi.ts` intact. In case of critical backend failure, a feature flag can revert the UI to use the mock service layer.
- Git revert the auth route changes if SSR breaks.

## 17. Ordered Implementation Checklist
- [ ] 1. Await user approval of this plan.
- [ ] 2. Initialize Supabase project and define SQL migrations (Tables, Triggers, RLS).
- [ ] 3. Install `@supabase/supabase-js` and `@supabase/ssr`.
- [ ] 4. Create Supabase client singletons for Server (`src/lib/supabase/server.ts`).
- [ ] 5. Implement Auth server functions (`src/server/auth.ts`).
- [ ] 6. Update `AccessPage` components and routes (`login`, `signup`) to use auth functions.
- [ ] 7. Implement Route Loaders for SSR session validation in protected routes.
- [ ] 8. Implement Profile server functions (`src/server/profiles.ts`).
- [ ] 9. Wire up `/onboarding` to update real profile data.
- [ ] 10. Implement Membership server functions and link to session context.
- [ ] 11. Run formatting, linting, and type-checks.
- [ ] 12. Verify flow in browser.
