import { useState } from "react";
import { Check, Heart, MessageCircle, Plus, Send, Users } from "lucide-react";
import { commitments as seedCommitments, checkIns, packMembers } from "@/data/progress";
import type { Commitment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function AccountabilityPage() {
  const [commitments, setCommitments] = useState(seedCommitments);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [reviewSent, setReviewSent] = useState(false);
  const [toast, setToast] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };
  const complete = (id: string) => {
    setCommitments((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completionPercentage: 100, status: "completed" } : item,
      ),
    );
    notify("Commitment marked complete");
  };
  const addCommitment = () => {
    if (!newTitle.trim()) return;
    const item: Commitment = {
      id: `commit-${Date.now()}`,
      title: newTitle,
      description: "A commitment you chose to keep visible.",
      startDate: "Aug 26",
      endDate: "Sep 01",
      completionPercentage: 0,
      status: "active",
    };
    setCommitments((items) => [item, ...items]);
    setNewTitle("");
    notify("Weekly commitment created");
  };
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-5 border-b border-border pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-gold">The 1% Club / Accountability</p>
            <h1 className="display-xl mt-2">Your Wolf Pack</h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
              Consistency becomes easier when your commitments are visible and your progress is
              supported.
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            Next group review · <strong className="text-foreground">Sunday, Sep 01</strong>
          </span>
        </header>
        <section className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-gold/15 text-gold">
                  <Users className="size-5" />
                </span>
                <div>
                  <CardTitle>Foundations Pack</CardTitle>
                  <CardDescription>3 members · Week 4 together</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                A small circle for making the work visible, celebrating honest effort and returning
                after missed days.
              </p>
              <div className="mt-5 flex -space-x-2">
                {packMembers.map((member) => (
                  <span
                    key={member.id}
                    title={member.name}
                    className="grid size-9 place-items-center rounded-full border-2 border-card bg-secondary text-xs font-bold text-foreground"
                  >
                    {member.initials}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Daily check-in</CardTitle>
              <CardDescription>How did you show up today?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ["completed", "Completed"],
                  ["partial", "Partially completed"],
                  ["not-completed", "Not completed"],
                  ["support-needed", "Need support"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => {
                      setCheckIn(id);
                      notify("Check-in submitted");
                    }}
                    className={cn(
                      "min-h-16 rounded-md border px-2 py-3 text-xs font-semibold transition-colors",
                      checkIn === id
                        ? "border-crimson bg-crimson/15 text-crimson-tint"
                        : "border-border bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {checkIn === id && <Check className="mx-auto mb-1 size-4" />}
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-1">
                {checkIns.map((item) => (
                  <span
                    key={item.id}
                    className={cn(
                      "h-2 flex-1 rounded-full",
                      item.status === "completed"
                        ? "bg-forest"
                        : item.status === "partial"
                          ? "bg-gold"
                          : "bg-secondary",
                    )}
                    title={`${item.dateLabel}: ${item.status}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-gold">Weekly commitments</p>
              <h2 className="display-lg mt-2">Keep the promise visible</h2>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">Aug 26 — Sep 01</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {commitments.map((commitment) => (
              <CommitmentCard
                key={commitment.id}
                commitment={commitment}
                onComplete={() => complete(commitment.id)}
              />
            ))}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="size-4 text-gold" />
                  Add commitment
                </CardTitle>
                <CardDescription>Choose one promise you can return to.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Commitment title"
                />
                <Button onClick={addCommitment} variant="secondary" className="w-full">
                  Create commitment
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        <section>
          <div className="mb-4">
            <p className="eyebrow text-gold">Pack members</p>
            <h2 className="display-lg mt-2">Progress with, not against</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {packMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-bold">
                      {member.initials}
                    </span>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.focus}</p>
                    </div>
                    <span
                      className={cn(
                        "ml-auto size-2 rounded-full",
                        member.checkInStatus === "checked-in" ? "bg-forest" : "bg-gold",
                      )}
                    />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{member.commitment}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Weekly progress</span>
                    <span className="font-mono text-gold">{member.progressPercentage}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${member.progressPercentage}%` }}
                    />
                  </div>
                  <Button
                    onClick={() => notify(`Encouragement sent to ${member.name}`)}
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full"
                  >
                    <Heart className="mr-2 size-4" />
                    Encourage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Personal reflection</CardTitle>
              <CardDescription>Make meaning from this week.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="What are you learning about how you show up?"
                rows={5}
              />
              <Button
                onClick={() => notify("Reflection saved")}
                disabled={!reflection.trim()}
                variant="secondary"
              >
                Save reflection
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Pack Review</CardTitle>
              <CardDescription>Submit before your Sunday review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "What did you commit to?",
                "What challenged you?",
                "What will you change next week?",
                "Who helped you this week?",
              ].map((prompt) => (
                <label key={prompt} className="block text-sm font-semibold">
                  {prompt}
                  <Input className="mt-2" placeholder="Write a short response" />
                </label>
              ))}
              <Button
                onClick={() => {
                  setReviewSent(true);
                  notify("Weekly review submitted");
                }}
                disabled={reviewSent}
                className="w-full"
              >
                <Send className="mr-2 size-4" />
                {reviewSent ? "Review submitted" : "Submit weekly review"}
              </Button>
            </CardContent>
          </Card>
        </section>
        {toast && (
          <div
            role="status"
            className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md border border-forest/40 bg-charcoal px-4 py-3 text-sm font-semibold text-forest-tint shadow-elevated"
          >
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
function CommitmentCard({
  commitment,
  onComplete,
}: {
  commitment: Commitment;
  onComplete: () => void;
}) {
  return (
    <Card variant={commitment.status === "missed" ? "crimson" : "bordered"}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "eyebrow",
              commitment.status === "completed"
                ? "text-forest-tint"
                : commitment.status === "missed"
                  ? "text-crimson-tint"
                  : "text-gold",
            )}
          >
            {commitment.status}
          </span>
          <span className="text-xs text-muted-foreground">
            {commitment.startDate} — {commitment.endDate}
          </span>
        </div>
        <CardTitle className="mt-2">{commitment.title}</CardTitle>
        <CardDescription>{commitment.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Completion</span>
          <span className="font-mono">{commitment.completionPercentage}%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full",
              commitment.status === "completed"
                ? "bg-forest"
                : commitment.status === "missed"
                  ? "bg-crimson"
                  : "bg-gold",
            )}
            style={{ width: `${commitment.completionPercentage}%` }}
          />
        </div>
        {commitment.status === "active" && (
          <Button onClick={onComplete} variant="ghost" size="sm" className="mt-4 w-full">
            <Check className="mr-2 size-4" />
            Mark complete
          </Button>
        )}
        {commitment.status === "missed" && (
          <Button onClick={() => undefined} variant="ghost" size="sm" className="mt-4 w-full">
            <MessageCircle className="mr-2 size-4" />
            Reset commitment
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
