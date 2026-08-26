import { createFileRoute } from "@tanstack/react-router";
import { RestoredPage } from "@/components/brand/restored-pages";

export const Route = createFileRoute("/mindset")({
  component: () => <RestoredPage kind="mindset" />,
});
