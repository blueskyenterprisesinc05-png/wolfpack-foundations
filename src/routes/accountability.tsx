import { createFileRoute } from "@tanstack/react-router";
import { AccountabilityPage } from "@/components/accountability/accountability-page";

export const Route = createFileRoute("/accountability")({ component: AccountabilityPage });
