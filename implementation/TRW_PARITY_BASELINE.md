# TRW Parity Baseline

## Global Navigation Map

The primary navigation structure consists of five top-level destinations:

1. **Chat** (Campus/community/channel communication)
2. **Courses** (Learning ecosystem)
3. **Inbox** (Private/direct communication)
4. **Market** (Marketplace/business)
5. **More** (Account/system destinations)

## Area Hierarchies

### Chat Hierarchy

- **Campus Selector** (Header dropdown/context switch)
- **Categories** (Collapsible groupings, e.g., Community, Resources)
- **Channels** (Individual chat rooms within categories)
- **Channel Message Feed** (The main chat interface)
- **Campus Members** (Side panel/view)
  - Online Count
  - Rank Groups (Top G, Professor, etc.)
  - Member Profiles/Rows

### Course Hierarchy

- **Course List** (Vertical stack of course cards)
- **Course Detail**
- **Modules / Sections** (Expandable groupings)
- **Lesson List** (Compact rows)
- **Progress** (Visual progress bars and completion states)
- **Checklists** (Task completion interactions)

### Inbox Hierarchy

- **Conversation List** (Preview of recent messages)
- **Private Messages** (One-to-one conversation interface)
- **Permissions**: Enforce friend-only message permissions (mocked at UI level for now).

### Market Status

- **Placeholder**: The Market area will be a clearly labeled placeholder.
- No fabricated marketplace data or actions will be added.

### More Menu Hierarchy

- **Profile** (Identity, status, badges)
- **Settings** (Account preferences)
- **Subscription / Account Pages**
- **Support**
- **Secondary System Destinations**

## Current Route Mapping

- `/chat` -> Maps to Chat architecture (Campus, Channels)
- `/courses` -> Maps to Course architecture and lessons
- `/inbox` -> Maps to Inbox architecture
- `/market` -> Maps to Market placeholder
- `/more` -> Maps to More menu, Profile, Settings

_(Note: Existing routes like `/community`, `/trading`, `/mindset` will be temporarily bypassed or mapped into this structure as appropriate without deleting their files until the final transition)._

## Mock vs. Real Functionality

- **Real**: Basic routing, navigation state, authenticated user session, profile viewing (where backend exists).
- **Mock**: Chat messages, course progress, marketplace, inbox history, real-time presence.
- **Rule**: Use existing mock data only where the UI clearly indicates presentation-only state. Do not invent fake realtime presence, unread counts, or subscription data.

## Features Requiring Backend Work

- Real-time Chat and Inbox message persistence.
- Live online counts and member presence.
- Genuine subscription data and marketplace logic.
- Gamification, XP, and rank progression.

## Features Deferred Until Brand-Tweak Phase

- The 1% Club specific navigation substitutions (e.g., removing/merging Inbox, renaming sections).
- Wolfpack terminology tweaks and branding.
- Final visual theme adjustments beyond the baseline dark palette.

## Implementation Phases

1. **Global shell and navigation**
2. **Chat/campus structure**
3. **Courses and lessons**
4. **Inbox and More**
5. **States, loading, reconnection, modals, sheets, and responsive polish**

_(Work will stop for review after each phase)._
