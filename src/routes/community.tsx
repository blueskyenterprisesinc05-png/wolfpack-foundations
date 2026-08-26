import { createFileRoute } from "@tanstack/react-router";
import { CommunityPage } from "@/components/community/community-page";

export const Route = createFileRoute("/community")({ component: CommunityPage });
