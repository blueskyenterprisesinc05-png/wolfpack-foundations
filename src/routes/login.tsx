import { createFileRoute } from "@tanstack/react-router";
import { AccessPage } from "@/components/brand/access-pages";
export const Route = createFileRoute("/login")({ component: () => <AccessPage kind="login" /> });
