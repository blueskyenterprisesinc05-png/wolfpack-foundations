# Project Context Plan

## Current State

The project "Wolfpack Foundations" (User-facing product name: "The 1% Club") has just been initialized for backend development. We currently have a frontend implemented with React 19, TanStack Start/Router, Vite, Tailwind CSS, and TypeScript. However, there is no centralized documentation detailing the project's identity, brand relationship, architecture, technical debt, and next steps for the backend build. The `implementation/GITHUB_ISSUES_GUIDE.md` file does not currently exist.

## Problem Being Solved

To ensure consistent, organized, and effective backend development by Antigravity, we need a reliable source of truth document (`PROJECT_CONTEXT.md`). This document will orient future AI assistants, clarify domain knowledge (e.g., brand tone, separation of frontend/backend concerns), document existing architecture and technical debt, and prevent incorrect assumptions regarding the frontend stack or backend implementation details. We also need to define the GitHub Issues format for task tracking.

## Target Architecture

The output of this task is purely documentation. We will create:

- `PROJECT_CONTEXT.md` at the root of the repository.
- `implementation/ISSUES.md` for issue tracking.
- `implementation/GITHUB_ISSUES_GUIDE.md` for issue formatting rules.

No application code, database tables, or backend services will be created in this bootstrap phase.

## Files That May Change

- `implementation/PROJECT_CONTEXT_PLAN.md` (This file, created)
- `implementation/GITHUB_ISSUES_GUIDE.md` (To be created)
- `implementation/ISSUES.md` (To be created)
- `PROJECT_CONTEXT.md` (To be created)

## Environment Variables Needed

None. (Documentation task only)

## API Design

None. (Documentation task only)

## Database or Storage Changes

None. (Documentation task only)

## Frontend Changes

None. (Documentation task only)

## Security Considerations

None. (Documentation task only)

## Testing and Verification Plan

- Verify that `PROJECT_CONTEXT.md` is valid Markdown.
- Verify that the documented routes match `src/routes/`.
- Verify that the development commands match `package.json`.
- Ensure verified facts are distinguished from assumptions.
- Ensure no contradictions with the existing repository structure.

## Rollback Considerations

Since this task only involves adding markdown files, a rollback simply entails deleting these newly created files (`PROJECT_CONTEXT.md`, `implementation/ISSUES.md`, `implementation/GITHUB_ISSUES_GUIDE.md`).

## Proposed GitHub Issues Guide Format

Since `implementation/GITHUB_ISSUES_GUIDE.md` does not exist, here is the proposed format to be approved:

```markdown
# GitHub Issues Guide

All issues recorded in `implementation/ISSUES.md` must follow this format:

### Issue #[Number]: [Title]

**Status:** [Open | In Progress | Closed]
**Description:**
[A brief description of the task.]

**Acceptance Criteria:**

- [ ] Criterion 1
- [ ] Criterion 2

**Notes:**
[Any additional context or technical considerations.]
```

## Ordered Implementation Checklist

- [ ] 1. Await user approval of this `PROJECT_CONTEXT_PLAN.md` and the proposed `GITHUB_ISSUES_GUIDE.md` format.
- [ ] 2. Create `implementation/GITHUB_ISSUES_GUIDE.md` with the approved format.
- [ ] 3. Create `implementation/ISSUES.md` and record issues for this bootstrap task (Inspecting repository, Creating PROJECT_CONTEXT.md, Verifying routes/commands, etc.).
- [ ] 4. Draft `PROJECT_CONTEXT.md` based on repository inspection, covering all 18 sections requested by the user.
- [ ] 5. Change issue statuses to "In Progress" as they are worked on.
- [ ] 6. Review `PROJECT_CONTEXT.md` for accuracy against `package.json` and `src/routes`.
- [ ] 7. Mark relevant checklist items as complete and update issue statuses to "Closed" in `ISSUES.md`.
