import { createFileRoute } from "@tanstack/react-router";
import { PublicLanding } from "@/components/brand/public-landing";

export const Route = createFileRoute("/")({
  component: PublicLanding,
});
