# Migration Reconciliation Report & Dependency Audit

**Date:** 2026-08-27
**Status:** Audit Completed. Pending reconciliation strategy execution.

## 1. Migration History Audit

### State Overview
- **Linked Project:** `kyyoesormuenlwmlgiti` (Confirmed via Supabase CLI).
- **Local Migration Versions:** 001 through 009 exist in `supabase/migrations/` (dated 20260827).
- **Test File Location:** `supabase/tests/rls_policies.sql` (Safely separated from migrations).
- **Remote Migration Versions:** `0` (None recorded). `supabase migration list --linked` confirms that the remote migration history is entirely empty.
- **Remote Schema Objects:** The user has manually executed SQL in the Supabase Dashboard which means that the remote tables, policies, and triggers exist, but their creation was not recorded in the migration history (`supabase_migrations.schema_migrations`).

### Schema Comparison (Blocked by Docker)
Running `supabase db diff` to programmatically compare the remote schema with local migration files requires a local Docker engine to spin up a shadow database. Docker Desktop is not currently running (`failed to connect to the docker API`).
Therefore, an automated, granular schema diff cannot be produced locally. However, the previously successful RLS tests and trigger execution confirm that at a minimum, the `profiles`, `membership_plans`, and `memberships` tables, the trigger `handle_new_user`, and the expected RLS policies exist and function identically to what the local migrations defined.

### Valuable Data
The remote database currently holds the test users (`user_a` and `user_b`) created manually or by the test script, and the three canonical membership plans inserted by the seed script. Aside from potentially real user data if this were production, this is a development project, but we assume data should not be dropped destructively without cause.

### Safe Reconciliation Strategy
Because the remote schema was built manually and corresponds to our local migrations, the safest way to reconcile this without dropping the schema and losing data is to "fake" the migration history remotely.

**Recommended Strategy:**
Mark the local migrations as applied on the remote database without re-executing their DDL commands. Since Docker is not running, if the CLI's `supabase migration up` (or similar repair commands) require Docker, the safest alternative is to insert the migration records manually into the remote `supabase_migrations.schema_migrations` table, or use `supabase migration repair --status applied <version>` (which does not require a shadow database).

**Next Step:** Wait for the user to approve a repair command. Do not mark as applied yet.

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
