import { createFileRoute, redirect } from "@tanstack/react-router";

// Phase 0: the home route is not built yet (Phase 1 public brand surface).
// Point "/" at the styleguide so the preview is reviewable instead of blank.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/styleguide" });
  },
});
