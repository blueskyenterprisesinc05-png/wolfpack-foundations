# Implementation Plan: Frontend Routes (About & Pricing)

## Current State

The project currently has a basic routing setup with `src/routes/` but lacks the intended `/about` and `/pricing` public routes. We have a set of brand components (e.g. `src/components/brand/navigation.tsx`, `src/components/brand/public-landing.tsx`) but the links to `/about` and `/pricing` might be missing or broken.

## Problem Being Solved

We need to add the `/about` and `/pricing` pages matching the design system and messaging of "The 1% Club". These pages must be accessible from navigation and footers, fully responsive, and completely disconnected from any real backend logic.

## Target Architecture

- Add `src/routes/about.tsx` using the `FileRoute` API from `@tanstack/react-router`.
- Add `src/routes/pricing.tsx` using the `FileRoute` API from `@tanstack/react-router`.
- Update navigation components in `src/components/brand/navigation.tsx` and `src/components/brand/public-landing.tsx` (or wherever footer/header links reside) to point to the new routes.

## Files That May Change

- `src/routes/about.tsx` (New)
- `src/routes/pricing.tsx` (New)
- `src/components/brand/navigation.tsx`
- `src/components/brand/public-landing.tsx` (and potentially `src/routes/index.tsx` or `src/routes/__root.tsx` if footer exists there)

## Environment Variables Needed

None.

## API Design

None. Purely frontend static content.

## Database or Storage Changes

None.

## Frontend Changes

- **About Page (`/about`)**: A new component detailing the purpose of The 1% Club, MindfulWolf relationship, core values, Mind Lab, Trading Room, and Wolf Packs. Use the "MindfulWolf inspires the change. The 1% Club creates the system for living it." message.
- **Pricing Page (`/pricing`)**: A new component presenting Explorer, Member, and Inner Circle plans, feature comparison, founding-member messaging, FAQs, and a placeholder for checkout. Add trading-risk language. Use the "Membership checkout will be connected in a future phase." message.
- **Navigation**: Update the header and footer (Desktop and Mobile) to include links to `/about` and `/pricing`.

## Security Considerations

Ensure no actual payment functionality or API calls are made. Emphasize trading-risk language on the pricing page. Avoid making profit guarantees or income claims.

## Testing and Verification Plan

- Format code (`bun run format`).
- Lint code (`bun run lint`).
- TypeScript check (`bunx tsc --noEmit`).
- Production build (`bun run build`).
- Verify `/about` and `/pricing` load directly and via browser refresh.
- Verify desktop and mobile (300x535) layouts.
- Verify existing routes remain intact.
- Verify no backend integrations are present.

## Rollback Considerations

Remove `src/routes/about.tsx` and `src/routes/pricing.tsx`. Revert changes in `src/components/brand/navigation.tsx` and `src/components/brand/public-landing.tsx`.

## Ordered Implementation Checklist

- [x] 1. Await user approval of this plan.
- [x] 2. Create GitHub Issues in `implementation/ISSUES.md`.
- [x] 3. Create `src/routes/about.tsx`.
- [x] 4. Create `src/routes/pricing.tsx`.
- [x] 5. Update navigation in `src/components/brand/navigation.tsx`.
- [x] 6. Update landing/footer links in `src/components/brand/public-landing.tsx` and `src/routes/index.tsx` if necessary.
- [x] 7. Run formatting, linting, and build commands.
- [x] 8. Update Issue statuses in `implementation/ISSUES.md`.

## Verification Record

**Vercel Deployment URL:** https://wolfpack-foundations.vercel.app/

**Verification method:** Manual — performed by the product owner on 2026-08-27.

**Routes verified (direct navigation + browser refresh):**

| Route             | Status |
| ----------------- | ------ |
| /                 | ✅ OK  |
| /about            | ✅ OK  |
| /pricing          | ✅ OK  |
| /login            | ✅ OK  |
| /signup           | ✅ OK  |
| /onboarding       | ✅ OK  |
| /dashboard        | ✅ OK  |
| /mindset          | ✅ OK  |
| /trading          | ✅ OK  |
| /progress         | ✅ OK  |
| /accountability   | ✅ OK  |
| /community        | ✅ OK  |
| /sessions         | ✅ OK  |
| /profile          | ✅ OK  |
| /settings         | ✅ OK  |
| /admin            | ✅ OK  |
| /styleguide       | ✅ OK  |
| /courses/mind-lab | ✅ OK  |
| /lessons/ml2      | ✅ OK  |

**Viewport checks:**

- Desktop: ✅ Passed
- 300×535 mobile (/, /about, /pricing): ✅ Passed

**Navigation and footer links:** ✅ Passed

**Browser console errors:** ✅ None

**Profit guarantees or income claims on /pricing:** ✅ None present

**Checkout on /pricing:** ✅ Placeholder only

**Deployment protection:** ✅ Not blocked — deployment is publicly accessible
