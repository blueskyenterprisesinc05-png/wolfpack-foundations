import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/profile/settings-page";

export const Route = createFileRoute("/settings")({ component: SettingsPage });
