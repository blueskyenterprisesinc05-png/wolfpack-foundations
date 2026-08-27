/**
 * Brand mark is served from the project so production does not depend on a CDN.
 * Keep every surface pointed at this single local asset path.
 */
export const BRAND_MARK_URL = "/favicon.ico";

export const BRAND = {
  name: "The 1% Club",
  shortName: "1%",
  tagline: "Become 1% Better Every Day.",
  markUrl: BRAND_MARK_URL,
  markAlt: "The 1% Club wolf mark",
} as const;
