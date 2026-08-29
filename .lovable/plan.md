# UI/UX Overhaul — Reference-Informed Restructure

Goal: adopt the interaction model and information architecture of the reference app (The Real World) while keeping The 1% Club brand: obsidian/charcoal surfaces, gold accent, crimson/forest for state, Bebas Neue display + Barlow body.

## What the reference actually does well

From the recorded frames, four patterns drive its feel:

1. **Persistent bottom tab bar on mobile, always 5 slots** (Chat, Courses, Inbox, Market, More) — never a hamburger. Active tab = tinted tile + gold icon and label.
2. **Sticky context header per section** with a section title, a dropdown to switch context (campus / channel), plus 2-3 utility icons (search, calendar, locale).
3. **Segmented tab strip under the header** (Courses / In Progress / Favorites, Checklist / Schedule) with a full-width progress-style underline that also acts as a scroll indicator.
4. **Card-per-item with one dominant action.** Course card = artwork, title, subtitle, gold progress bar, "% complete", then a full-width solid gold CTA. Nothing competes with it.
5. **Status is always colour-coded and always literal**: gold = active/in-progress, green = recurring/online, crimson = overdue/failed, inside a tinted crimson panel with its own recovery CTA.

## Where I'd deviate (challenges)

- **Do not copy their solid gold primary CTA.** Our locked ruling is primary = stark off-white on obsidian. Gold stays the *progress and state* colour. Copying the gold button would collapse our state language into our action language. I propose: primary CTA off-white, and a new `gold` button variant used only for the single highest-intent action on a page (Renew, Continue lesson).
- **Their density is accidental, not designed** — emoji badge rows, 4 icons after a username, inconsistent spacing. We adopt the *ambition* (show rank, streak, badges inline) but with a capped badge row: max 3 badges + "+N".
- **Their headers stack 3 bars deep** before content. We collapse to 2: sticky context header + segmented tabs.
- **Their empty states are bare labels** ("Add a task"). We keep our existing `states.tsx` empty/loading treatments.
- **Type case**: their titles are title-case sentence wraps. Bebas is uppercase and tight, so card titles stay Barlow semibold; Bebas is reserved for section headers and stats.

## Plan of work

### 1. Navigation model (mobile-first)
- Replace the current member sidebar/hamburger pattern with a **persistent 5-slot bottom tab bar** on mobile: The Den, Mind Lab, Trading, Pack, More. Active = charcoal tile + gold icon/label, min 44px targets.
- Desktop keeps a left rail but restyled to the reference's icon+label density with a gold active indicator bar.
- Add a `MoreSheet` for overflow destinations (Progress, Accountability, Sessions, Profile, Settings, Styleguide).

### 2. Section header + segmented tabs primitives
- New `SectionHeader`: sticky, holds a Bebas title, an optional context switcher dropdown, and up to 3 icon actions.
- New `SegmentedTabs`: horizontally scrollable, gold active label, animated underline; used by Courses, Checklist, Community.

### 3. Course cards and Learning Center
- Rework `course-grid.tsx` into reference-style cards: 96px artwork slot, Barlow title, muted subtitle, gold progress bar, "% complete" line, full-width CTA.
- Tabs become All / In Progress / Completed / Favourites with a count chip on Favourites.
- Locked courses get a dimmed artwork + lock overlay instead of a ghost button.

### 4. Status and state surfaces
- New `StatusPanel` component: tinted crimson/gold/forest panel with icon, message, and an inline recovery CTA — used for missed check-ins, broken streaks, and billing states.
- Standardise the state colour map already locked: gold active, forest complete/recurring, crimson missed.

### 5. Community / Pack list
- Adopt the grouped roster: role heading + count, avatar with rank crown, name coloured by role tier, capped badge row.
- Online count pill with a forest dot in the channel header.

### 6. Checklist / accountability
- Adopt grouped task cards with a per-group add affordance, recurring badge in forest, scheduled time in muted, and a bottom-docked composer input with a gold send button.

### 7. Polish pass
- Scroll-linked sticky header shadow, tab underline transition on `--motion-base`, card press states, and a mobile safe-area inset for the tab bar.

## Technical notes

- All new components live under `src/components/brand/` and reuse existing tokens in `src/styles.css`; new tokens only if needed (`--tab-indicator`, safe-area padding utility).
- New `gold` variant added to `button.tsx` via cva; no hardcoded colour classes anywhere.
- `member-shell.tsx` becomes the single layout owner of header + bottom nav + `<Outlet />`; `navigation.tsx` is split into `top-bar.tsx`, `bottom-nav.tsx`, `side-rail.tsx`.
- Purely presentational: no data-layer or auth changes, mock data in `src/data/*` stays as-is (extended only where a card needs a new display field such as `artwork` or `favourite`).

## Sequencing

I'll ship this in three reviewable steps: (1) navigation model + primitives, (2) Learning Center + status surfaces, (3) Pack, checklist, and polish. I stop after each.
