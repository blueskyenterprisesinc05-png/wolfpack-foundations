/**
 * src/server/auth.ts
 *
 * Auth server functions for The 1% Club.
 *
 * Security rules:
 * - User identity is always derived from the server-side session (auth.uid()).
 *   No userId parameter is ever accepted from the client.
 * - All inputs are validated with Zod before reaching Supabase.
 * - Error messages are normalised — raw Supabase internals are never
 *   forwarded to the client.
 * - Session cookies are HTTP-only and managed by createSupabaseServerClient.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "../lib/supabase/server";

// ── Input schemas ─────────────────────────────────────────────────────────────

const emailPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

// ── Error normalisation ───────────────────────────────────────────────────────

/**
 * Maps raw Supabase error messages to user-friendly strings.
 * Never forward Supabase internals to the client.
 */
function normalizeAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (m.includes("email not confirmed")) {
    return "Please verify your email address before signing in.";
  }
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "An account with this email address already exists.";
  }
  if (m.includes("password") && m.includes("weak")) {
    return "Please choose a stronger password (at least 8 characters).";
  }
  if (m.includes("rate limit") || m.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  // Generic fallback — do not expose the raw message.
  return "Something went wrong. Please try again.";
}

// ── Server functions ──────────────────────────────────────────────────────────

// NOTE: getSessionFn is defined in src/lib/session.ts.
// It lives outside src/server/ so route files can import it without
// triggering TanStack Start's import-protection bundler rule.
// Write operations (signIn, signUp, signOut) are defined below.

/**
 * signUpFn
 * Creates a new auth user with email and password.
 * With email confirmation disabled, returns an immediate session.
 * With email confirmation enabled, returns needsEmailConfirmation: true.
 */
export const signUpFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => emailPasswordSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false as const, error: normalizeAuthError(error.message) };
    }

    // If email confirmation is required, Supabase returns a user but no session.
    if (!authData.session) {
      return { success: true as const, needsEmailConfirmation: true };
    }

    return { success: true as const, needsEmailConfirmation: false };
  });

/**
 * signInWithEmailFn
 * Signs in with email and password.
 * On success, Supabase sets the session cookie via setAll.
 */
export const signInWithEmailFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => emailPasswordSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false as const, error: normalizeAuthError(error.message) };
    }

    return { success: true as const };
  });

/**
 * signOutFn
 * Invalidates the current server-side session.
 * No client input accepted.
 */
export const signOutFn = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false as const, error: normalizeAuthError(error.message) };
  }
  return { success: true as const };
});

/**
 * requestPasswordResetFn
 * Sends a password-reset email with a magic link.
 * Always returns success to avoid user enumeration.
 */
export const requestPasswordResetFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => emailSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    // Redirect the user to /reset-password after clicking the email link.
    const redirectTo = `${import.meta.env["VITE_SUPABASE_URL"]}/reset-password`;
    await supabase.auth.resetPasswordForEmail(data.email, { redirectTo });
    // Always return success to prevent user enumeration.
    return { success: true as const };
  });
