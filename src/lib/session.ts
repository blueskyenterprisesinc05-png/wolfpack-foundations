/**
 * src/lib/session.ts
 *
 * Thin session utility for use in route files (beforeLoad, loaders).
 *
 * TanStack Start's import-protection plugin denies direct imports from
 * src/server/ in client-side bundles. This module re-defines the read-only
 * session check using createServerFn so it lives outside the denied path
 * while still executing server-side via the RPC bridge.
 *
 * Write operations (signIn, signUp, signOut) remain in src/server/auth.ts
 * and are imported only by component files (access-pages.tsx), not routes.
 */
import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "./supabase/server";

/**
 * Returns the currently authenticated user from the server-side session.
 * Uses getUser() to validate the JWT on every call (not getSession()).
 * Returns { user: null } when unauthenticated.
 */
export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { user: null };
  return { user };
});
