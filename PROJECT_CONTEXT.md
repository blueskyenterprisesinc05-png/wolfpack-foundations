# Project Context: Wolfpack Foundations

## 1. Project Identity

- **Codebase name:** Wolfpack Foundations
- **Product name:** The 1% Club
- **Creator brand:** MindfulWolf
- **Current date:** August 27, 2026
- **Context-file version:** 1.0.0
- **Last updated date:** August 27, 2026

## 2. Product Purpose

The 1% Club is a personal-growth and skills community that helps members improve through:

- Discipline
- Emotional mastery
- Accountability
- Consistent learning
- Integrity
- Contribution
- Practical skill development

Trading is one important learning path inside the club, not the entire identity of the product.

## 3. Brand Relationship

- MindfulWolf is the creator and voice.
- The 1% Club is the community and digital environment.
- Trading is one learning path.
- The platform should feel connected to MindfulWolf while remaining a distinct brand.

**Approved Visual Direction:**

- Dark cinematic atmosphere.
- Obsidian and charcoal backgrounds.
- Off-white typography.
- Crimson actions.
- Limited warm gold.
- Forest-green success states.
- Wolf symbolism used sparingly.
- Calm, serious, focused, premium, and disciplined tone.

## 4. Frontend Ownership

- **v0** is the primary production frontend tool.
- **Lovable** may be used for visual experiments or alternative UI concepts.
- **Antigravity** owns backend implementation.
- v0 and Lovable must not independently overwrite the same production frontend files.
- The frontend and backend must communicate through an agreed API contract.
- The frontend must preserve loading, error, empty, unauthorized, and success states.

## 5. Current Frontend Architecture

Based on repository inspection:

- **Framework:** React (v19) with TanStack Start (v1.168.32) and TanStack Router (v1.170.18).
- **Build tool:** Vite (v8.1.5).
- **Styling:** Tailwind CSS (v4.2.1) and a Radix UI-based component system.
- **Language:** TypeScript.
- **Package manager:** Bun.
- **Main source directories:** `src/components/`, `src/data/`, `src/hooks/`, `src/lib/`, `src/routes/`, `src/services/`, `src/types/`.
- **Server entry point:** `src/server.ts`.
- **Mock Data Layer:** Existing local mock datasets in `src/data/` (`admin.ts`, `community.ts`, `member.ts`, `mock.ts`, `profile.ts`, `progress.ts`, `sessions.ts`).
- **Service Layer:** Exists at `src/services/mockApi.ts`.
- **Types:** Existing TypeScript types in `src/types/index.ts`.
- **Deployment target:** Vercel (using Nitro internally in devDependencies).
- **Note:** The repository contains a dev dependency `@lovable.dev/vite-tanstack-config`. This is documented as an existing build dependency only. Do not assume the product is currently being developed with Lovable, and do not remove this dependency without a separate approved task.

## 6. Current Routes

Actual routes found in `src/routes/`:

- `/` (`index.tsx`)
- `/accountability` (`accountability.tsx`)
- `/admin` (`admin.tsx`)
- `/community` (`community.tsx`)
- `/courses/*` (directory for course routing)
- `/dashboard` (`dashboard.tsx`)
- `/lessons/*` (directory for lesson routing)
- `/login` (`login.tsx`)
- `/mindset` (`mindset.tsx`)
- `/onboarding` (`onboarding.tsx`)
- `/profile` (`profile.tsx`)
- `/progress` (`progress.tsx`)
- `/sessions` (`sessions.tsx`)
- `/settings` (`settings.tsx`)
- `/signup` (`signup.tsx`)
- `/styleguide` (`styleguide.tsx`)
- `/trading` (`trading.tsx`)

**Contradictions / Missing Intended Routes:**

- `/about` and `/pricing` were listed as intended public routes, but they do not currently exist in the repository.

## 7. Current Frontend Product State

Features currently implemented/mocked in the frontend:

- Public landing page (`/`)
- Mock login (`/login`) and signup (`/signup`)
- Onboarding (`/onboarding`)
- The Den dashboard (`/dashboard`)
- Mind Lab (`/mindset`)
- Trading Room (`/trading`)
- Course detail and Lesson detail pages (`/courses`, `/lessons`)
- Progress (`/progress`)
- Accountability (`/accountability`)
- The Pack community (`/community`)
- Wolf Sessions (`/sessions`)
- Profile (`/profile`)
- Settings (`/settings`)
- Admin Dashboard (`/admin`)
- Styleguide (`/styleguide`)

_All the above features currently rely on mock data and are awaiting backend integration._

## 8. Current Mock Data

The `src/data/` directory contains files for mock data matching TypeScript interfaces (`src/types/index.ts`) and utilized by the mock service (`src/services/mockApi.ts`):

- Members and Profiles (`member.ts`, `profile.ts`)
- Progress, Missions, Commitments, Check-ins, Reflections, Achievement Marks (`progress.ts`)
- Community posts, comments, likes, Wolf Packs (`community.ts`)
- Wolf Sessions, Attendance (`sessions.ts`)
- Admin metrics and activity (`admin.ts`)
- General mock data (`mock.ts`)

The UI components currently fetch this data through the mock API service layer, maintaining separation from direct UI implementation.

## 9. Backend Ownership and Status

- **Antigravity** is responsible for the backend.
- The backend runtime and exact implementation stack are not yet final until approved.
- Do not assume Next.js.
- Do not assume `app/api/[route]/route.ts`.
- Do not assume Supabase unless the backend architecture is approved.
- Do not assume that Vercel is the backend host.
- Do not assume that the frontend and backend share the same repository structure without inspecting it.

The backend will eventually need to support: Authentication, Profiles, Membership status, Learning paths, Courses, Lessons, Enrolments, Lesson progress, Missions, Accountability, Wolf Packs, Community, Wolf Sessions, Notifications, Admin operations, and eventually Payments.

## 10. API Contract Rules

- The API contract must be agreed upon before frontend integration.
- Request and response types must be explicit.
- Validation must happen at server boundaries.
- Errors must use a predictable format.
- Authentication requirements must be documented per endpoint.
- Pagination must be documented for community and admin data.
- The frontend must not guess response shapes.
- The frontend service layer should remain separate from UI components.

## 11. Security Constraints

These non-negotiable requirements must be followed:

- Never expose private server secrets to the browser.
- Never expose database service credentials to the browser.
- Never trust the client to set membership status.
- Never trust the client to confirm payment success.
- Never allow client-side admin role assignment.
- Validate all server inputs.
- Enforce ownership and authorization server-side.
- Use rate limits for authentication and user-generated content.
- Sanitize community content.
- Protect private member data.
- Keep financial and trading-related functionality educational unless separately approved and legally reviewed.
- Do not implement trade execution, broker connections, copy trading, or custody of member funds without a separate approved architecture and compliance review.

## 12. Payments

- Payments are not currently integrated.
- Future payment options may include Paystack or Flutterwave, but no provider has been approved yet.
- **Do not add:** Checkout, Subscription activation, Payment webhooks, Payment records, or Membership billing logic until a separate payment architecture plan is approved.

## 13. Deployment

- **Frontend deployment target:** Vercel
- **Build command:** `bun run build`
- **Preview / dev command:** `bun run dev`
- Further deployment protection details, branch preview settings, and environment variable requirements are pending confirmation based on the eventual Vercel project configuration.

## 14. Development Commands

Verified exact commands from `package.json`:

- Development: `bun run dev` (maps to `vite dev`)
- Production build: `bun run build` (maps to `vite build`)
- Linting: `bun run lint` (maps to `eslint .`)
- Formatting: `bun run format` (maps to `prettier --write .`)

_Note:_ There is no explicit type-check command (like `tsc --noEmit`) or test command defined in `package.json` scripts currently.

## 15. Known Technical Debt

- **Missing intended routes:** `/about` and `/pricing` do not exist.
- **Missing type-check script:** `tsc --noEmit` is not in `package.json` scripts.
- Existing frontend features rely completely on mock data.
- Vercel deployment configuration or direct-route fallback settings (like `vercel.json` rewrites) have not been fully audited or established in the repository root.

## 16. Source-of-Truth Rules

- Product decisions belong in project documentation.
- API decisions belong in the API contract.
- Database changes belong in version-controlled migrations.
- UI design decisions belong in the frontend design system.
- Backend changes belong to Antigravity.
- Production frontend changes belong to v0.
- Lovable experiments must be reviewed before entering production code.
- Git history and implementation issue status must remain accurate.

## 17. Current Next Steps

The recommended next phases:

1. Backend architecture approval.
2. Authentication and profile vertical slice.
3. Membership status.
4. Learning data.
5. Progress and accountability.
6. Community.
7. Sessions and notifications.
8. Payments.
9. Admin permissions and operations.

## 18. Change Log

| Date       | Summary                                | Related Plan                             | Related Issue | Author      |
| ---------- | -------------------------------------- | ---------------------------------------- | ------------- | ----------- |
| 2026-08-27 | Initial creation of PROJECT_CONTEXT.md | `implementation/PROJECT_CONTEXT_PLAN.md` | Issue #1      | Antigravity |
