import { createFileRoute, redirect } from "@tanstack/react-router";
import { RestoredPage } from "@/components/brand/restored-pages";

export const Route = createFileRoute("/trading")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: () => <RestoredPage kind="trading" />,
});
