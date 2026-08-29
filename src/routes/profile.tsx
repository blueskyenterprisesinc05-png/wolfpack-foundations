import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProfilePage } from "@/components/profile/profile-page";

export const Route = createFileRoute("/profile")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: ProfilePage,
});
