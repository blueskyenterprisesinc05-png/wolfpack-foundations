import { createFileRoute } from "@tanstack/react-router";
import { SessionsPage } from "@/components/sessions/sessions-page";

export const Route = createFileRoute("/sessions")({ component: SessionsPage });
