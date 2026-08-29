/**
 * src/lib/supabase/config.ts
 *
 * Resolves the Supabase project URL + publishable key.
 *
 * `.env.local` only exists in local development — hosted preview/production
 * builds do not receive it, which previously left the clients with `undefined`
 * credentials and crashed the app on first render. Both values below are
 * publishable (browser-safe), so they are checked in as fallbacks.
 */
const FALLBACK_URL = "https://kyyoesormuenlwmlgiti.supabase.co";
const FALLBACK_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5eW9lc29ybXVlbmx3bWxnaXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NTcwMzAsImV4cCI6MjEwMzQzMzAzMH0.nIorUv36ltk-FCjTpnVMp29aKdhR4yK6dhvAiijUZ4U";

export const SUPABASE_URL =
  import.meta.env["VITE_SUPABASE_URL"] || FALLBACK_URL;

export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || FALLBACK_PUBLISHABLE_KEY;
