import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/brand/app-shell";
import { Send } from "lucide-react";
import { communityMembers, communityPosts } from "@/data/community";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: InboxPage,
});

// Build static conversations from existing mock members + posts
const conversations = communityMembers.map((member, idx) => ({
  member,
  preview: communityPosts[idx % communityPosts.length]?.body.slice(0, 60) + "…",
  timeLabel: communityPosts[idx % communityPosts.length]?.createdLabel ?? "Recently",
}));

function InboxPage() {
  const [selectedId, setSelectedId] = useState<string>(conversations[0]?.member.id ?? "");
  const selected = conversations.find((c) => c.member.id === selectedId);

  // Use the matching post body as the single mock message in the thread
  const threadPost = communityPosts.find((p) => p.memberId === selectedId);

  return (
    <AppShell>
      <div className="flex h-[calc(100dvh-3.5rem-4rem)] lg:h-dvh w-full overflow-hidden bg-background">
        {/* ── Conversation List (Left pane) ────────────────────── */}
        <aside className="flex w-full flex-col border-r border-border bg-charcoal sm:w-80 sm:shrink-0">
          <div className="flex h-14 shrink-0 items-center border-b border-border px-5">
            <h1 className="font-bold text-foreground">Inbox</h1>
          </div>
          <nav className="flex-1 overflow-y-auto" aria-label="Conversations">
            {conversations.map(({ member, preview, timeLabel }) => (
              <button
                key={member.id}
                onClick={() => setSelectedId(member.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-secondary/40",
                  selectedId === member.id && "bg-accent",
                )}
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-muted-foreground">
                  {member.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm font-semibold",
                        selectedId === member.id ? "text-gold" : "text-foreground",
                      )}
                    >
                      {member.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeLabel}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{preview}</p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Thread Detail (Right pane) ────────────────────────── */}
        <main className={cn("hidden flex-1 flex-col overflow-hidden sm:flex")}>
          {selected ? (
            <>
              {/* Thread header */}
              <div className="flex h-14 shrink-0 items-center border-b border-border px-5 gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                  {selected.member.initials}
                </div>
                <span className="font-semibold text-foreground">{selected.member.name}</span>
              </div>

              {/* Message thread */}
              <div className="flex-1 overflow-y-auto px-5 py-6">
                {threadPost ? (
                  <div className="flex gap-3">
                    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                      {selected.member.initials}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {selected.member.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {threadPost.createdLabel}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 leading-6">{threadPost.body}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No messages yet.</p>
                )}
              </div>

              {/* Disabled compose area */}
              <div className="shrink-0 border-t border-border bg-charcoal p-4">
                <div className="flex items-center gap-2 opacity-50">
                  <input
                    type="text"
                    disabled
                    placeholder="Private messaging unavailable — coming soon."
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  />
                  <button
                    disabled
                    className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                    aria-label="Send (unavailable)"
                  >
                    <Send className="size-4" />
                    Send
                  </button>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Sending messages requires a future backend integration.
                </p>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center">
              <p className="text-sm text-muted-foreground">Select a conversation to view it.</p>
            </div>
          )}
        </main>
      </div>
    </AppShell>
  );
}
