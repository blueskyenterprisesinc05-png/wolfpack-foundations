# Supabase Migrations — The 1% Club / Wolfpack Foundations

This directory contains all version-controlled SQL migrations for the backend database.

## Execution

The Supabase project for The 1% Club is:

- **Project URL:** `https://kyyoesormuenlwmlgiti.supabase.co`
- **Project ref:** `kyyoesormuenlwmlgiti`

Run the following commands to link the CLI and apply all migrations:

```bash
# Link the CLI to this project (run once per environment)
supabase link --project-ref kyyoesormuenlwmlgiti

# Apply all pending migrations
supabase db push

# Or reset to a clean state and re-apply from scratch (dev only — destroys all data)
supabase db reset
```

## Environment Variables Required

These must be set in the Supabase CLI environment before running migrations:

| Variable                | Where to set                     |
| ----------------------- | -------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI config or CI secret |
| `SUPABASE_DB_PASSWORD`  | Supabase project dashboard       |

**Do not commit these values to the repository.**

## Migration Order

| File                                        | Description                                                   |
| ------------------------------------------- | ------------------------------------------------------------- |
| `20260827_001_create_profiles.sql`          | Create `profiles` table and `set_updated_at` trigger function |
| `20260827_002_profile_trigger_function.sql` | Create `handle_new_user()` SECURITY DEFINER function          |
| `20260827_003_auth_trigger.sql`             | Attach trigger to `auth.users`                                |
| `20260827_004_create_membership_plans.sql`  | Create `membership_plans` table                               |
| `20260827_005_seed_membership_plans.sql`    | Seed Explorer, Member, Inner Circle plans                     |
| `20260827_006_create_memberships.sql`       | Create `memberships` table                                    |
| `20260827_007_indexes.sql`                  | Add performance indexes                                       |
| `20260827_008_enable_rls.sql`               | Enable RLS on all three tables                                |
| `20260827_009_rls_policies.sql`             | Add all RLS policies                                          |
| `20260827_010_rls_tests.sql`                | Executable RLS acceptance tests (rolled back after run)       |

## RLS Test Execution

```bash
psql "$DATABASE_URL" -f supabase/migrations/20260827_010_rls_tests.sql
```

The test file runs inside a transaction that is rolled back at the end.
All tests produce PASS/FAIL NOTICE messages. Any FAIL assertion raises an error.

## Secret Safety

- No secret keys are in any migration file.
- No `VITE_` variables contain secrets.
- The `.env.local` file is gitignored.
- Service-role keys are not used in Phase 6B.
