import { createFileRoute } from "@tanstack/react-router";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";

export const Route = createFileRoute("/progress")({ component: ProgressDashboard });
