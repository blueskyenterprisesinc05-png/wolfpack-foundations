/**
 * src/lib/supabase/browser.ts
 *
 * Browser-only Supabase client.
 * Safe for use in client components and form handlers.
 * Never import this file in server functions.
 */
import { createBrowserClient } from "@supabase/ssr";

let _client: ReturnType<typeof createBrowserClient> | undefined;

/** Returns a singleton browser Supabase client. */
export function getBrowserClient() {
  if (!_client) {
    _client = createBrowserClient(
      import.meta.env["VITE_SUPABASE_URL"],
      import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
    );
  }
  return _client;
}
