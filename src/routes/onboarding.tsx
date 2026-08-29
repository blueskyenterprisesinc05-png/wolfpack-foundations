import { createFileRoute, redirect } from "@tanstack/react-router";
import { AccessPage } from "@/components/brand/access-pages";
export const Route = createFileRoute("/onboarding")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: () => <AccessPage kind="onboarding" />,
});
