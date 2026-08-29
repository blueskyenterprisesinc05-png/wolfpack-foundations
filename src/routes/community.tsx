import { createFileRoute, redirect } from "@tanstack/react-router";
import { CommunityPage } from "@/components/community/community-page";

export const Route = createFileRoute("/community")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: CommunityPage,
});
