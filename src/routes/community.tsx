import { createFileRoute, redirect } from "@tanstack/react-router";
import { ChatPage } from "./chat";

export const Route = createFileRoute("/community")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: ChatPage,
});
