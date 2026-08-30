import { communityPosts } from "@/data/community";
import { Send, MessageSquare } from "lucide-react";
import { SkeletonChatMessage } from "@/components/brand/states";
import { EmptyState } from "@/components/brand/states";

export function ChatFeed({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden relative bg-background">
      <div className="hidden h-14 shrink-0 items-center border-b border-border px-6 md:flex">
        <span className="text-sm font-semibold text-foreground">💬 General Chat</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        {isLoading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonChatMessage key={i} />
            ))}
          </div>
        ) : communityPosts.length === 0 ? (
          <div className="grid h-full place-items-center">
            <EmptyState
              icon={<MessageSquare className="size-5" />}
              title="No messages yet"
              description="Be the first to post in this channel."
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {communityPosts.map((post) => (
              <div key={post.id} className="flex gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-muted-foreground">
                  {post.memberId.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {post.memberId}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.createdLabel}</span>
                  </div>
                  <div className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">
                    {post.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-charcoal">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Message #General Chat..."
            disabled
            className="w-full rounded-xl border border-border bg-background py-3 pl-4 pr-12 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
          />
          <button
            disabled
            className="absolute right-2 p-2 text-muted-foreground hover:text-gold disabled:opacity-50"
          >
            <Send className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Note: Chat functionality is currently mocked for presentation.
        </p>
      </div>
    </div>
  );
}
