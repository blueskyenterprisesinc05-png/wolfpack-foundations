/**
 * Brand mark asset. Phase 0 registers a CDN pointer only — no binary in the repo.
 * Replace BRAND_MARK_URL with the hosted wolf-head URL; every surface reads from here.
 */
export const BRAND_MARK_URL = "https://cdn.gpteng.co/blank-app-v1.svg";

export const BRAND = {
  name: "The 1% Club",
  shortName: "1%",
  tagline: "Become 1% Better Every Day.",
  markUrl: BRAND_MARK_URL,
  markAlt: "The 1% Club wolf mark",
} as const;
