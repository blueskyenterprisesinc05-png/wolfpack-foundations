import { createFileRoute, redirect } from "@tanstack/react-router";
import { RestoredPage } from "@/components/brand/restored-pages";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: () => <RestoredPage kind="dashboard" />,
});
