import * as React from "react";
import {
  Bookmark,
  Check,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import {
  communityCategories,
  communityComments,
  communityGuidelines,
  communityMembers,
  communityPosts,
} from "@/data/community";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categoryNames: Record<string, string> = {
  mindset: "Mindset",
  trading: "Trading",
  discipline: "Discipline",
  wins: "Wins",
};

export function CommunityPage() {
  const [category, setCategory] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState("recent");
  const [liked, setLiked] = React.useState<string[]>([]);
  const [bookmarked, setBookmarked] = React.useState<string[]>(["p2"]);
  const [comments, setComments] = React.useState(communityComments);
  const [commentText, setCommentText] = React.useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newPost, setNewPost] = React.useState({ category: "mindset", title: "", body: "" });
  const [posts, setPosts] = React.useState(communityPosts);
  const visible = posts
    .filter(
      (post) =>
        (category === "all" || post.category === category) &&
        `${post.title} ${post.body}`.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => (sort === "popular" ? b.likes - a.likes : b.createdAt - a.createdAt));
  const member = (id: string) =>
    communityMembers.find((item) => item.id === id) ?? communityMembers[0];
  const addComment = (postId: string) => {
    const body = commentText[postId]?.trim();
    if (!body) return;
    setComments((items) => [
      ...items,
      { id: `local-${Date.now()}`, postId, memberId: "marcus", body, createdLabel: "Just now" },
    ]);
    setCommentText((items) => ({ ...items, [postId]: "" }));
    toast.success("Comment added");
  };
  const publish = () => {
    if (!newPost.title.trim() || !newPost.body.trim())
      return toast.error("Add a title and reflection first");
    setPosts((items) => [
      {
        id: `local-${Date.now()}`,
        memberId: "marcus",
        category: newPost.category,
        title: newPost.title,
        body: newPost.body,
        createdLabel: "Just now",
        createdAt: 99,
        likes: 0,
        comments: 0,
        bookmarked: false,
      },
      ...items,
    ]);
    setNewPost({ category: "mindset", title: "", body: "" });
    setDialogOpen(false);
    toast.success("Your post is live in The Pack");
  };

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-gold">The 1% Club / Community</p>
            <h1 className="display-xl mt-2">The Pack</h1>
            <p className="mt-3 max-w-xl text-pretty text-sm leading-6 text-muted-foreground">
              A place to share the work, learn from the process, and keep each other moving forward.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="size-4" />
                Share with the pack
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Share with The Pack</DialogTitle>
                <DialogDescription>
                  Keep it honest, useful, and rooted in your own process.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  value={newPost.category}
                  onValueChange={(value) => setNewPost((item) => ({ ...item, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {communityCategories.slice(1).map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  aria-label="Post title"
                  placeholder="Give your reflection a title"
                  value={newPost.title}
                  onChange={(event) =>
                    setNewPost((item) => ({ ...item, title: event.target.value }))
                  }
                />
                <Textarea
                  aria-label="Post reflection"
                  placeholder="What are you noticing?"
                  value={newPost.body}
                  maxLength={500}
                  onChange={(event) =>
                    setNewPost((item) => ({ ...item, body: event.target.value }))
                  }
                />
                <p className="text-right text-xs text-muted-foreground">
                  {newPost.body.length}/500
                </p>
                <Button onClick={publish} className="w-full">
                  Publish reflection <Send className="size-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>
        <Card variant="gold" className="overflow-hidden">
          <CardContent className="flex gap-4 p-5">
            <div className="grid size-10 shrink-0 place-items-center rounded-md bg-gold/15 text-gold">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="eyebrow text-gold">Pinned by the moderators</p>
              <h2 className="mt-1 font-display text-xl">Build in public, without performing.</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Share what is real. Ask thoughtful questions. Celebrate the quiet wins. Trading
                conversations are educational only — never share guaranteed returns or personalized
                financial advice.
              </p>
            </div>
          </CardContent>
        </Card>
        <section className="flex flex-col gap-3" aria-label="Community filters">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {communityCategories.map((item) => (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={cn(
                  "shrink-0 rounded-md border px-3 py-2 text-xs font-semibold",
                  category === item.id
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border text-muted-foreground hover:bg-secondary",
                )}
              >
                {item.label}
                <span className="ml-2 opacity-60">{item.count}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                aria-label="Search posts"
                placeholder="Search the pack"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-40">
                <SlidersHorizontal className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recent</SelectItem>
                <SelectItem value="popular">Most popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="space-y-4" aria-live="polite">
            {visible.length ? (
              visible.map((post) => {
                const author = member(post.memberId);
                const postComments = comments.filter((comment) => comment.postId === post.id);
                const isLiked = liked.includes(post.id);
                return (
                  <Card key={post.id} variant="bordered">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg text-gold">
                            {author.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {author.handle} · {post.createdLabel}
                            </p>
                          </div>
                        </div>
                        <button
                          aria-label="More post actions"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            toast("Report placeholder", {
                              description: "Moderation tools will be connected in a future phase.",
                            })
                          }
                        >
                          <MoreHorizontal className="size-5" />
                        </button>
                      </div>
                      <div>
                        <span className="eyebrow text-gold">{categoryNames[post.category]}</span>
                        <h2 className="mt-2 text-lg font-semibold text-balance">{post.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.body}</p>
                      </div>
                      <div className="flex items-center gap-1 border-t border-border pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Like ${post.title}`}
                          onClick={() =>
                            setLiked((items) =>
                              isLiked ? items.filter((id) => id !== post.id) : [...items, post.id],
                            )
                          }
                        >
                          <Heart className={cn("size-4", isLiked && "fill-crimson text-crimson")} />
                          {post.likes + (isLiked ? 1 : 0)}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}
                        >
                          <MessageCircle className="size-4" />
                          {postComments.length}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          aria-label={`Bookmark ${post.title}`}
                          onClick={() =>
                            setBookmarked((items) =>
                              items.includes(post.id)
                                ? items.filter((id) => id !== post.id)
                                : [...items, post.id],
                            )
                          }
                        >
                          <Bookmark
                            className={cn(
                              "size-4",
                              bookmarked.includes(post.id) && "fill-gold text-gold",
                            )}
                          />
                        </Button>
                      </div>
                      {postComments.map((comment) => (
                        <div key={comment.id} className="border-l-2 border-border pl-3 text-sm">
                          <p className="text-muted-foreground">
                            <strong className="text-foreground">
                              {member(comment.memberId).name}
                            </strong>{" "}
                            · {comment.createdLabel}
                          </p>
                          <p className="mt-1 leading-5">{comment.body}</p>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          id={`comment-${post.id}`}
                          aria-label={`Comment on ${post.title}`}
                          placeholder="Add to the conversation"
                          value={commentText[post.id] ?? ""}
                          onChange={(event) =>
                            setCommentText((items) => ({ ...items, [post.id]: event.target.value }))
                          }
                          onKeyDown={(event) => {
                            if (
                              event.key === "Enter" &&
                              !event.nativeEvent.isComposing &&
                              event.keyCode !== 229
                            )
                              addComment(post.id);
                          }}
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          aria-label="Send comment"
                          onClick={() => addComment(post.id)}
                        >
                          <Send className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card variant="bordered">
                <CardContent className="p-10 text-center">
                  <p className="font-display text-2xl">Nothing here yet.</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try another filter or share the first reflection.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
          <aside className="space-y-4">
            <Card variant="bordered">
              <CardContent className="space-y-4 p-5">
                <p className="eyebrow text-gold">Community guidelines</p>
                {communityGuidelines.map((guideline) => (
                  <div key={guideline.id}>
                    <h3 className="text-sm font-semibold">{guideline.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{guideline.body}</p>
                  </div>
                ))}
                <div className="flex items-center gap-2 border-t border-border pt-3 text-xs text-forest">
                  <Check className="size-4" /> Moderated with care
                </div>
              </CardContent>
            </Card>
            <Card variant="bordered">
              <CardContent className="p-5">
                <p className="eyebrow text-gold">Pack pulse</p>
                <p className="mt-2 font-display text-3xl">142</p>
                <p className="text-sm text-muted-foreground">members showing up this week</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
