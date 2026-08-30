import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatFeed } from "@/components/chat/chat-feed";

export const Route = createFileRoute("/chat")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: ChatPage,
});

export function ChatPage() {
  return (
    <AppShell>
      <ChatLayout>
        <ChatFeed />
      </ChatLayout>
    </AppShell>
  );
}
