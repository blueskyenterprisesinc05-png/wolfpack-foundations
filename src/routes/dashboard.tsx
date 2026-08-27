import { createFileRoute } from "@tanstack/react-router";
import { RestoredPage } from "@/components/brand/restored-pages";

export const Route = createFileRoute("/dashboard")({
  component: () => <RestoredPage kind="dashboard" />,
});
