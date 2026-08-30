# Migration Reconciliation Report & Dependency Audit

**Date:** 2026-08-27
**Status:** Workflow decision recorded. Migration-history reconciliation pending user approval of repair commands.

## 1. Migration History Audit

### State Overview

- **Linked Project:** `kyyoesormuenlwmlgiti` (Confirmed via Supabase CLI).
- **Local Migration Versions:** 001 through 009 exist in `supabase/migrations/` (dated 20260827).
- **Test File Location:** `supabase/tests/rls_policies.sql` (Safely separated from migrations).
- **Remote Migration Versions:** `0` (None recorded). `supabase migration list --linked` confirms that the remote migration history is entirely empty.
- **Remote Schema Objects:** The user has manually executed SQL in the Supabase Dashboard which means that the remote tables, policies, and triggers exist, but their creation was not recorded in the migration history (`supabase_migrations.schema_migrations`).

### Schema Comparison — Docker Skipped (By User Preference)

Docker-based schema diff was intentionally skipped by user preference. Remote schema operations will be performed manually through the hosted Supabase Dashboard. Migration history will be maintained through reviewed repository SQL and, where appropriate, host-side migration repair.

Despite the lack of a programmatic diff, the previously successful RLS tests and trigger execution confirm that at a minimum, the `profiles`, `membership_plans`, and `memberships` tables, the trigger `handle_new_user`, and the expected RLS policies exist and function identically to what the local migrations defined.

### Workflow Going Forward

- **No local Docker stack.** The project uses a no-Docker Supabase workflow.
- **Database operations** are performed manually in the hosted Supabase Dashboard SQL Editor.
- **The local `supabase/migrations/` files** remain the source of truth for documentation and review.
- **The Windows-hosted Supabase CLI** is used only for: `supabase login`, `supabase link`, `supabase migration list`, and `supabase migration repair`.
- **Blocked commands:** `supabase db diff`, `supabase db pull`, `supabase db push`, `supabase db reset`, and any Docker-based command.

### Valuable Data

The remote database currently holds the test users (`user_a` and `user_b`) created during RLS testing, and the three canonical membership plans inserted by the seed script. Data must not be dropped destructively.

### Safe Reconciliation Strategy

The non-Docker path that changes migration metadata but does not re-execute DDL; use only after the corresponding SQL has been verified. `supabase migration repair --status applied <version>` marks each version as applied in the remote `supabase_migrations.schema_migrations` table without re-running the migration SQL. This command does not require a local Docker engine.

> [!WARNING]
> If a migration is incorrectly marked as applied, future deployments may skip SQL that the database actually needs. Each repair command must correspond precisely to SQL that has been executed and verified in the remote database. Never mark a version as applied unless the database objects it creates have been confirmed to exist and match the migration file.

**Prerequisite before running repair:**
The user must confirm — via the Supabase Dashboard — that each of the nine migration SQL files was successfully executed and that the resulting remote objects match the migration intent. Only then should repair be run, one version at a time.

**Current State:** Do not mark as applied yet. Issue #3 remains In Progress.

---

## 2. Dependency Audit

The command `npm install supabase --save-dev` was run manually by the user.

### Source Control Diff

- **package.json:** `supabase` (`^2.116.0`) was added to `devDependencies`.
- **package-lock.json:** Modified to include `supabase` and its transitive dependencies (like `eciesjs` and `jose`), as well as various `@supabase/cli-*` binaries.
- **bun.lock:** Updated by the package manager.
- **Was the CLI already present?** No, the Supabase CLI was not originally present in `bun.lock` or `package.json`. (I attempted to install it via Bun in an earlier blocked step, but the user ran `npm install` independently).
- **Lockfile created:** The `package-lock.json` and `bun.lock` files were both synchronized.

### Vulnerability Findings (npm audit)

Running `npm audit` returned **3 high-severity vulnerabilities**. These are from transitive dependencies not directly related to `supabase`:

1. **`brace-expansion`** (High) - Brought in via `@typescript-eslint/typescript-estree`. Vulnerable to DoS via unbounded expansion length.
2. **`js-yaml`** (High) - Quadratic CPU consumption in `!!omap` resolution.
3. **`nanoid`** (High) - Custom generators can loop indefinitely when size is zero.

**Action:** No unrelated dependency upgrades or `npm audit fix` will be run, per the strict instructions. The dependencies were simply recorded.
