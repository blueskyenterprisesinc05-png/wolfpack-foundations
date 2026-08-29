# UI/UX Redesign — Reference-Informed Restructure

Adopt the structural UI/UX of the reference app (bottom tab nav, nested category lists, tabbed learning centre, module/lesson lists, checklist, grouped roster) while keeping the Wolfpack Foundations / The 1% Club aesthetic: obsidian + charcoal surfaces, warm gold accents, crimson/forest state colours, Bebas Neue display + Barlow body.

Your plan is sound. I agree with all four of your challenge resolutions. Below is the merged version with corrections and five additional challenges.

## Agreed

1. **Icons, not emojis** — Lucide only, tinted with brand tokens. Emojis are the single cheapest-looking thing in the reference.
2. **Gamification adopted, re-skinned** — progress bars, rank sheet, inline badges; geometric marks instead of crowns/medals; our vocabulary (Marks, Streak, Pack Rank).
3. **Responsive collapse** — bottom tab bar on mobile, left rail on desktop, nested category list as a secondary column.
4. **Nested collapsible category lists** as a reusable primitive.

## Corrections to file targets

- There is no `src/components/layout/Shell.tsx`. The member layout owner is `src/components/brand/member-shell.tsx`; nav lives in `src/components/brand/navigation.tsx`. The redesign edits those.
- There is no `src/routes/courses/index.tsx` — only `src/routes/courses/$courseId.tsx`. The learning centre today is `src/components/brand/course-grid.tsx`, rendered inside member pages. Either it gets rebuilt in place or we add a `courses.index.tsx` route; I recommend adding the index route so Courses is a real destination for the tab bar.
- `src/components/accountability/accountability-page.tsx`, `community/community-page.tsx`, and `profile/profile-page.tsx` already exist — those get rebuilt rather than created new.

## Additional challenges

**5. Five tabs, but not that order.** Putting Dashboard third (centre) borrows a pattern the reference doesn't actually use, and The Den is our most-visited screen. Proposal: `The Den`, `Learning`, `Pack`, `Progress`, `More` — home first, left to right, no centre-hero slot. Community is behind "Pack" and lives one tap in, matching our brand voice.

**6. Do not copy the solid gold primary button.** Our locked ruling is primary = stark off-white on obsidian, gold = progress/state. The reference's gold `Start Course` button collapses state language into action language. Proposal: primary stays off-white; add a `gold` button variant reserved for exactly one highest-intent action per screen (Continue lesson, Renew).

**7. Skip the countdown-to-midnight timer as the headline.** A live `12:27:20` clock creates urgency anxiety and clashes with "calm and disciplined". Proposal: show "Resets at midnight" plus a thin gold day-progress bar; keep the numeric countdown as a small muted secondary.

**8. Cap the inline badge row.** The reference puts 4-6 glyphs after a username and it reads as noise. Proposal: max 3 badges inline + `+N` overflow that opens the profile sheet.

**9. Two header bars maximum.** The reference stacks browser chrome, promo bar, context header, and tab strip before any content — on a 375px screen content starts halfway down. Proposal: sticky context header (title + optional context switcher + up to 3 icon actions) and a segmented tab strip. Nothing else above the fold.

**10. Card titles stay Barlow.** Bebas is uppercase and tightly tracked; the reference's wrapping title-case course titles would become unreadable blocks. Bebas is reserved for section headers and stat numerals.


## Improvements over the reference (agreed)

1. **Focus over hype** — emojis and mixed weights out, brand-tinted Lucide icons in.
2. **Clearer hierarchy** — The Den separates "must do today" (checklist, check-in, missed-streak recovery) from "can read" (announcements, sessions), instead of one undifferentiated vertical list.
3. **Premium empty and loading states** — real skeletons per card shape, and empty states in brand voice ("All tasks completed. Take a breath."), reusing `states.tsx`.
4. **Meaningful gamification** — Consistency Streak, Risk Adherence, Accountability Score instead of coins/power levels. Rewards process adherence, not app activity.



## Proposed changes

### 1. Shell and navigation
- `member-shell.tsx` becomes the single layout owner: sticky header + content + bottom tab bar (mobile) / left rail (desktop, icon+label with gold active indicator).
- Split `navigation.tsx` into `top-bar.tsx`, `bottom-nav.tsx`, `side-rail.tsx`.
- New `more-sheet.tsx` for overflow destinations: Sessions, Accountability, Profile, Settings, Styleguide.
- Bottom bar respects safe-area inset; every target ≥ 44px.

### 2. Primitives
- `nested-list.tsx` — collapsible category groups with chevron, icon + label rows, optional notification dot/count.
- `section-header.tsx` — sticky, Bebas title, optional context switcher, up to 3 icon actions.
- `segmented-tabs.tsx` — scrollable, gold active label, underline transition on `--motion-base`.
- `status-panel.tsx` — tinted crimson/gold/forest panel with icon, message, inline recovery CTA (missed check-in, broken streak, billing).

### 3. Learning centre
- New `courses.index.tsx` route; `course-grid.tsx` rebuilt as reference-style cards: icon/artwork slot left, Barlow title + muted subtitle right, gold progress bar, "% complete", full-width CTA.
- Tabs: All / In Progress / Completed / Favourites (count chip). Locked courses dim the artwork and show a lock at the right edge instead of a ghost button.

### 4. Course / module view
- `courses/$courseId.tsx` gets a header with title and "N modules • N lessons", then a vertical lesson list with per-lesson state (complete = forest check, active = gold, locked = muted lock).

### 5. Profile, ranks, roster
- `profile-sheet.tsx` — bottom sheet with Pack Rank, progress to next rank, earned Marks, active roles.
- `leaderboard-list.tsx` — roster grouped by rank with count in the heading, avatar + rank mark, name tinted by tier, capped badge row; online count pill with forest dot in the channel header.

### 6. Checklist
- `checklist-view.tsx` — grouped task blocks with per-group add affordance, forest "Daily" repeat badge, muted scheduled time, bottom-docked "Describe your task" composer with a gold send button, reset indicator per challenge 7.

### 7. Token discipline pass
- Audit every component for hardcoded colour utilities; everything routes through `src/styles.css` tokens. Add only what's needed (tab indicator, safe-area utility).

## Technical notes

- Presentational only: no data-layer, auth, or Cloud changes. Mock data in `src/data/*` extended only for display fields (`artwork`, `favourite`, `rank`).
- New `gold` variant added to `button.tsx` via cva.
- Each new route defines its own `head()` metadata.

## Verification

- Preview at 375×812: tab bar reachable, content above the fold, nested lists and locked states match the reference structure.
- Desktop: rail + secondary column, no orphaned bottom bar.
- Grep for hardcoded colour classes returns nothing in touched files.

## Sequencing

Three reviewable steps, stopping after each: (1) shell, navigation, primitives; (2) learning centre + course/module + status surfaces; (3) profile/roster, checklist, token pass.
