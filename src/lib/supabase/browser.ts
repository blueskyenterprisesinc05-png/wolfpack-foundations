/**
 * src/lib/supabase/browser.ts
 *
 * Browser-only Supabase client.
 * Safe for use in client components and form handlers.
 * Never import this file in server functions.
 */
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

let _client: ReturnType<typeof createBrowserClient> | undefined;

/** Returns a singleton browser Supabase client. */
export function getBrowserClient() {
  if (!_client) {
    _client = createBrowserClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
    );
  }
  return _client;
}
