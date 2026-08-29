/**
 * src/lib/supabase/server.ts
 *
 * Per-request server-side Supabase client.
 * Must be created fresh for every server function invocation.
 * Never share a single instance across requests.
 *
 * Uses @supabase/ssr with TanStack Start's built-in cookie utilities so auth
 * tokens are stored in HTTP-only cookies and never exposed to JavaScript.
 */
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { getRequest, setCookie } from "@tanstack/react-start/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

export function createSupabaseServerClient() {
  const request = getRequest();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        // Parse the Cookie header from the incoming request.
        return parseCookieHeader(request?.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        // Write each auth cookie into the response.
        // httpOnly + secure flags prevent client-side JS from accessing these.
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(name, value, {
            ...options,
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: "lax",
          });
        });
      },
    },
  });
}
