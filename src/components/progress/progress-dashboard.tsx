import { useState } from "react";
import { ArrowRight, Check, Flame, Lock, Play, Sparkles, Target, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  achievements,
  currentMission,
  missions,
  progressHistory,
  progressMetrics,
} from "@/data/progress";
import { MarkBadge } from "@/components/brand/content-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/brand/progress";
import { cn } from "@/lib/utils";

const icons = {
  Mindset: Sparkles,
  Trading: TrendingUp,
  Discipline: Target,
  Learning: Play,
  Accountability: Check,
} as const;

export function ProgressDashboard() {
  const [completedMission, setCompletedMission] = useState(false);
  const [loading, setLoading] = useState(false);
  const completeMission = () => {
    setLoading(true);
    window.setTimeout(() => {
      setCompletedMission(true);
      setLoading(false);
    }, 350);
  };
  const activity = completedMission ? "Protect the first hour" : "Completed a Mind Lab lesson";
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-5 border-b border-border pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-gold">The 1% Club / Progress</p>
            <h1 className="display-xl mt-2">Your Progress</h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
              Measured in consistent behaviour, honest learning and the small decisions that
              compound — not only financial results.
            </p>
          </div>
          <Link
            to="/styleguide"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Back to dashboard <ArrowRight className="ml-1 inline size-4" />
          </Link>
        </header>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Current level" value="Level 04" detail="Steady builder" icon={Sparkles} />
          <Stat
            label="Current streak"
            value="12 days"
            detail="Best: 18 days"
            icon={Flame}
            tone="gold"
          />
          <Stat
            label="Weekly consistency"
            value="88%"
            detail="+6% this week"
            icon={TrendingUp}
            tone="forest"
          />
          <Stat label="Learning hours" value="8.4h" detail="2.1h this week" icon={Play} />
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Card variant="crimson" className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-crimson-tint">1% Mission</p>
                <span className="text-xs font-semibold text-crimson-tint">
                  {completedMission ? "Completed" : currentMission.dueLabel}
                </span>
              </div>
              <CardTitle className="mt-2 text-3xl">{currentMission.title}</CardTitle>
              <CardDescription className="max-w-xl">{currentMission.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button onClick={completeMission} loading={loading} disabled={completedMission}>
                {completedMission ? (
                  <>
                    <Check className="mr-2 size-4" />
                    Mission complete
                  </>
                ) : (
                  "Complete mission"
                )}
              </Button>
              <span className="text-xs text-muted-foreground">
                Consistency is built in the next right action.
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Weekly summary</CardTitle>
              <CardDescription>Actions over outcomes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Summary label="Lessons completed" value="8 / 20" />
              <Summary
                label="Missions completed"
                value={completedMission ? "14 / 14" : "13 / 14"}
              />
              <Summary label="Accountability check-ins" value="6 / 7" />
            </CardContent>
          </Card>
        </section>
        <section>
          <SectionTitle eyebrow="Progress by practice" title="Where you are building capacity" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {progressMetrics.map((metric) => {
              const Icon = icons[metric.category];
              return (
                <Card key={metric.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-md bg-secondary text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <span className="font-mono text-sm text-gold">{metric.percentage}%</span>
                    </div>
                    <CardTitle className="mt-3 text-lg">{metric.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4">
                    <ProgressBar
                      value={metric.percentage}
                      tone={metric.percentage === 100 ? "forest" : "gold"}
                      label={`${metric.completed}/${metric.total} actions`}
                    />
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Continue <ArrowRight className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card>
            <CardHeader>
              <CardTitle>Monthly progress</CardTitle>
              <CardDescription>Your consistency trend across the last eight weeks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-44 items-end gap-2 border-b border-l border-border px-3 pb-0 pt-4">
                {progressHistory.map((value, index) => (
                  <div
                    key={index}
                    className="group flex flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">
                      {value}%
                    </span>
                    <div
                      className={cn(
                        "w-full max-w-10 bg-gold transition-all",
                        index === progressHistory.length - 1 && "bg-crimson",
                      )}
                      style={{ height: `${value}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Jul 08</span>
                <span>Aug 26</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Your latest proof of practice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Activity text={activity} date="Today" />
              <Activity text="Checked in with your Wolf Pack" date="Yesterday" />
              <Activity text="Completed Risk Before Reward" date="Aug 22" />
            </CardContent>
          </Card>
        </section>
        <section>
          <SectionTitle eyebrow="Achievement Marks" title="Consistency worth noticing" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  "rounded-lg border p-4",
                  achievement.state === "locked"
                    ? "border-dashed border-border opacity-60"
                    : achievement.state === "recent"
                      ? "border-gold/50 bg-gold/10"
                      : "border-border bg-charcoal",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-full",
                      achievement.state === "locked"
                        ? "bg-secondary text-muted-foreground"
                        : "bg-gold/15 text-gold",
                    )}
                  >
                    {achievement.state === "locked" ? (
                      <Lock className="size-4" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                  </span>
                  {achievement.state === "recent" && <span className="eyebrow text-gold">New</span>}
                </div>
                <p className="mt-4 font-semibold">{achievement.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {achievement.state === "locked"
                    ? achievement.description
                    : achievement.earnedLabel}
                </p>
              </div>
            ))}
          </div>
        </section>
        <Card className="border-forest/30 bg-forest/5">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow text-forest-tint">Next recommended action</p>
              <p className="mt-1 font-semibold">Complete the next Trading Room lesson</p>
              <p className="text-sm text-muted-foreground">
                Keep the process visible before the week gets noisy.
              </p>
            </div>
            <Link to="/courses/$courseId" params={{ courseId: "trading-room" }}>
              <Button variant="secondary">
                Open Trading Room <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
function Stat({
  label,
  value,
  detail,
  icon: Icon,
  tone = "muted",
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Sparkles;
  tone?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <span className="eyebrow">{label}</span>
          <Icon
            className={cn(
              "size-4",
              tone === "gold"
                ? "text-gold"
                : tone === "forest"
                  ? "text-forest"
                  : "text-muted-foreground",
            )}
          />
        </div>
        <p className="display-stat mt-4">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold text-foreground">{value}</span>
    </div>
  );
}
function Activity({ text, date }: { text: string; date: string }) {
  return (
    <div className="flex gap-3 border-b border-border pb-3 last:border-0">
      <span className="mt-1 size-2 shrink-0 rounded-full bg-forest" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{text}</p>
        <p className="mt-1 text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}
function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h2 className="display-lg mt-2">{title}</h2>
    </div>
  );
}
