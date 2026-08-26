import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Brain, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pageCopy = {
  dashboard: {
    eyebrow: "The Den",
    title: "Your practice, in one place.",
    body: "A quiet view of what matters today: one lesson, one commitment, and one honest check-in.",
    icon: Target,
    links: [
      ["Continue Mind Lab", "/courses/mind-lab"],
      ["Open Progress", "/progress"],
    ],
  },
  mindset: {
    eyebrow: "Mind Lab",
    title: "Train the part that chooses.",
    body: "Build awareness, focus, and emotional steadiness through small repeatable practices.",
    icon: Brain,
    links: [
      ["Start the course", "/courses/mind-lab"],
      ["View your progress", "/progress"],
    ],
  },
  trading: {
    eyebrow: "Trading Room",
    title: "Process over prediction.",
    body: "Study risk, rules, and review without pressure to take a position. This is educational content only.",
    icon: TrendingUp,
    links: [
      ["Enter Trading Room", "/courses/trading-room"],
      ["Read accountability", "/accountability"],
    ],
  },
} as const;

export function RestoredPage({ kind }: { kind: keyof typeof pageCopy }) {
  const content = pageCopy[kind];
  const Icon = content.icon;
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="border-b border-border pb-8">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1 className="display-xl mt-3 max-w-3xl text-foreground">{content.title}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
            {content.body}
          </p>
        </header>
        <section className="grid gap-4 md:grid-cols-3" aria-label={`${content.eyebrow} overview`}>
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <CardTitle className="mt-4">Today&apos;s next right step</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Keep the bar clear and the promise small. Return to the work that is already in
                front of you.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {content.links.map(([label, to]) => (
                  <Link
                    key={to}
                    className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    to={to as "/progress"}
                  >
                    {label}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Practice note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <ShieldCheck className="mt-1 size-4 shrink-0 text-primary" />
                <p>Progress is built through honest repetition, not perfect days.</p>
              </div>
            </CardContent>
          </Card>
        </section>
        <div className="flex items-center gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
          <BookOpen className="size-4" />
          <span>Learning surfaces remain available from The Den.</span>
          <Link
            className="font-semibold text-foreground underline-offset-4 hover:underline"
            to="/styleguide"
          >
            View styleguide
          </Link>
        </div>
      </div>
    </main>
  );
}
