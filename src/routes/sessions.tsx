import { createFileRoute, redirect } from "@tanstack/react-router";
import { SessionsPage } from "@/components/sessions/sessions-page";

export const Route = createFileRoute("/sessions")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: SessionsPage,
});
