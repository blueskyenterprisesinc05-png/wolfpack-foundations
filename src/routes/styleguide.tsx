import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/brand/logo";
import { SectionHeading, Stat } from "@/components/brand/section-heading";
import { InputField, TextareaField } from "@/components/brand/form-field";
import {
  ConsistencyMeter,
  ProgressBar,
  ProgressCircle,
  StreakCard,
} from "@/components/brand/progress";
import { CourseCard, GoalCard, LessonCard, MarkBadge } from "@/components/brand/content-cards";
import { CardSkeleton, EmptyState, ErrorState, ListSkeleton } from "@/components/brand/states";
import { RiskDisclaimer } from "@/components/brand/risk-disclaimer";
import { MemberSidebar, MobileBottomNav, TopBar } from "@/components/brand/navigation";
import { mockCourses, mockGoals, mockLessons, mockMarks, mockMember } from "@/data/mock";

export const Route = createFileRoute("/styleguide")({
  head: () => ({
    meta: [
      { title: "Styleguide — The 1% Club Design System" },
      {
        name: "description",
        content:
          "Phase 0 design system for The 1% Club: colour tokens, type scale, buttons, cards, forms, navigation and progress components.",
      },
      { property: "og:title", content: "Styleguide — The 1% Club" },
      {
        property: "og:description",
        content: "Every token, type style and component variant in one reviewable page.",
      },
    ],
  }),
  component: Styleguide,
});

const swatches = [
  { name: "Obsidian", token: "--bg-obsidian", hex: "#0B0B0D", cls: "bg-obsidian" },
  { name: "Charcoal", token: "--surface-charcoal", hex: "#151518", cls: "bg-charcoal" },
  { name: "Card grey", token: "--surface-card", hex: "#202024", cls: "bg-card" },
  { name: "Border", token: "--border-graphite", hex: "#303035", cls: "bg-border" },
  { name: "Text", token: "--text-primary", hex: "#F2F2F2", cls: "bg-foreground" },
  { name: "Muted", token: "--text-muted", hex: "#929297", cls: "bg-muted-foreground" },
  { name: "Crimson", token: "--brand-crimson", hex: "#C9364F", cls: "bg-crimson" },
  { name: "Crimson tint", token: "--brand-crimson-tint", hex: "text only", cls: "bg-crimson-tint" },
  { name: "Gold", token: "--brand-gold", hex: "#D4A84F", cls: "bg-gold" },
  { name: "Forest", token: "--brand-forest", hex: "#6FA879", cls: "bg-forest" },
];

function Block({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <SectionHeading {...(eyebrow ? { eyebrow } : {})}>{title}</SectionHeading>
      {children}
    </section>
  );
}

function Styleguide() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="grain min-h-screen bg-background">
      <div className="vignette border-b border-border px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Logo size="lg" />
          <h1 className="display-hero mt-6 text-foreground">Become 1% Better Every Day.</h1>
          <p className="body-lg mt-4 max-w-xl text-muted-foreground">
            Phase 0 design system. Tokens, typography and every component variant — dark only,
            mobile-first, semantic tokens throughout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button>Join the club</Button>
            <Button variant="secondary">See the curriculum</Button>
            <Button variant="ghost">Read the rules</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-8">
        <Block title="Colour" eyebrow="Tokens">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {swatches.map((s) => (
              <div key={s.name} className="rounded-lg border border-border bg-charcoal p-3">
                <div className={`h-14 w-full rounded-md ${s.cls}`} />
                <p className="mt-2.5 font-body text-sm font-semibold text-foreground">{s.name}</p>
                <p className="font-mono text-[0.6875rem] text-muted-foreground">{s.token}</p>
                <p className="font-mono text-[0.6875rem] text-muted-foreground">{s.hex}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Crimson passes AA only as a fill, border, or large type. Small crimson text uses the
            lightened tint token.
          </p>
        </Block>

        <Block title="Typography" eyebrow="Bebas Neue + Barlow">
          <div className="space-y-6 rounded-xl border border-border bg-charcoal p-6">
            <div>
              <p className="eyebrow mb-2">display-hero · h1 · hero only</p>
              <p className="display-hero text-foreground">The Den</p>
            </div>
            <div>
              <p className="eyebrow mb-2">display-xl · h2</p>
              <p className="display-xl text-foreground">Today's Work</p>
            </div>
            <div>
              <p className="eyebrow mb-2">display-lg · section header</p>
              <p className="display-lg text-foreground">Your Marks</p>
            </div>
            <div>
              <p className="eyebrow mb-2">display-stat · large numerics</p>
              <div className="flex flex-wrap gap-10">
                <Stat value="34" label="Day streak" tone="gold" />
                <Stat value="78%" label="Consistency" tone="forest" />
                <Stat value="2" label="Marks" />
              </div>
            </div>
            <div className="border-t border-border pt-6">
              <p className="eyebrow mb-2">Barlow — body, UI, card titles, buttons</p>
              <h3 className="text-lg">Card title / subheading (600)</h3>
              <p className="body-lg mt-2 max-w-2xl text-muted-foreground">
                Body copy runs in Barlow at a slightly larger size and looser leading than default,
                because light-on-dark text reads thinner. Sentence case, no all-caps.
              </p>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Small body copy, 14px — helper text, meta rows, timestamps.
              </p>
            </div>
          </div>
        </Block>

        <Block title="Buttons" eyebrow="One off-white primary per view">
          <div className="space-y-4 rounded-xl border border-border bg-charcoal p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="gold">Gold reward</Button>
              <Button variant="crimson">Close position</Button>
              <Button variant="destructive">Delete account</Button>
              <Button variant="link">Learn more</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Marks">
                <Trophy />
              </Button>
              <Button disabled>Disabled</Button>
              <Button
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1400);
                }}
              >
                {loading ? "Working" : "Trigger loading"}
              </Button>
            </div>
          </div>
        </Block>

        <Block title="Cards" eyebrow="Surfaces">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(["base", "elevated", "bordered", "gold", "crimson"] as const).map((v) => (
              <Card key={v} variant={v}>
                <CardHeader>
                  <CardTitle>{v} card</CardTitle>
                  <CardDescription>
                    {v === "gold"
                      ? "Achievement and membership surfaces."
                      : v === "crimson"
                        ? "High-stakes or broken-streak surfaces."
                        : "Standard content surface."}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            <Card variant="bordered" interactive>
              <CardHeader>
                <CardTitle>Interactive card</CardTitle>
                <CardDescription>Lifts on hover, 200ms ease-out.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Block>

        <Block title="Forms" eyebrow="Inputs">
          <div className="grid gap-6 rounded-xl border border-border bg-charcoal p-6 lg:grid-cols-2">
            <div className="space-y-4">
              <InputField label="Email" placeholder="you@example.com" helper="Demo only — nothing is stored." />
              <InputField label="Password" type="password" error="Password must be 8+ characters." />
              <TextareaField label="Session notes" placeholder="What did you follow today?" />
            </div>
            <div className="space-y-5">
              <div>
                <Label className="eyebrow mb-2 block">Select</Label>
                <Select>
                  <SelectTrigger className="h-11 border-border bg-obsidian">
                    <SelectValue placeholder="Choose a track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2.5">
                <Checkbox id="sg-check" defaultChecked />
                <Label htmlFor="sg-check" className="text-sm">I'll show up daily.</Label>
              </div>
              <div>
                <Label className="eyebrow mb-2 block">Radio group</Label>
                <RadioGroup defaultValue="am" className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <RadioGroupItem value="am" id="sg-am" />
                    <Label htmlFor="sg-am" className="text-sm">Morning session</Label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RadioGroupItem value="pm" id="sg-pm" />
                    <Label htmlFor="sg-pm" className="text-sm">Evening session</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="sg-switch" defaultChecked />
                <Label htmlFor="sg-switch" className="text-sm">Daily reminder</Label>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Navigation" eyebrow="Chrome">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-border">
              <TopBar action={<Button size="sm" variant="secondary">Check in</Button>} />
            </div>
            <div className="flex flex-wrap gap-5">
              <MemberSidebar />
              <div className="min-w-0 flex-1 space-y-5">
                <Tabs defaultValue="today">
                  <TabsList className="bg-charcoal">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This week</TabsTrigger>
                    <TabsTrigger value="all">All time</TabsTrigger>
                  </TabsList>
                  <TabsContent value="today" className="pt-4 text-sm text-muted-foreground">
                    Tab panel content.
                  </TabsContent>
                  <TabsContent value="week" className="pt-4 text-sm text-muted-foreground">
                    Weekly view.
                  </TabsContent>
                  <TabsContent value="all" className="pt-4 text-sm text-muted-foreground">
                    Lifetime view.
                  </TabsContent>
                </Tabs>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm">Account menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Demo Member</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem className="text-crimson-tint">Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="max-w-md">
                  <MobileBottomNav />
                </div>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Progress" eyebrow="Gold active · green complete · crimson broken">
          <div className="grid gap-4 lg:grid-cols-3">
            <StreakCard days={mockMember.progress.streakDays} bestDays={mockMember.progress.bestStreakDays} />
            <StreakCard days={0} bestDays={51} broken />
            <ConsistencyMeter pct={mockMember.progress.consistencyPct} />
          </div>
          <div className="grid gap-6 rounded-xl border border-border bg-charcoal p-6 lg:grid-cols-2">
            <div className="space-y-4">
              <ProgressBar value={62} tone="gold" label="Active course" />
              <ProgressBar value={100} tone="forest" label="Completed" />
              <ProgressBar value={28} tone="crimson" label="Missed check-ins" />
              <ProgressBar value={12} tone="neutral" label="Not started" />
            </div>
            <div className="flex flex-wrap items-center gap-8">
              <ProgressCircle value={78} caption="Consistency" tone="forest" />
              <ProgressCircle value={45} caption="Course" tone="gold" />
            </div>
          </div>
        </Block>

        <Block title="Content" eyebrow="Courses, goals, marks">
          <div className="grid gap-4 lg:grid-cols-3">
            {mockCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              {mockLessons.map((l) => (
                <LessonCard key={l.id} lesson={l} />
              ))}
            </div>
            <div className="space-y-2">
              {mockMarks.map((m) => (
                <MarkBadge key={m.id} mark={m} />
              ))}
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {mockGoals.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        </Block>

        <Block title="Feedback" eyebrow="States">
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Open modal</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Break your streak?</DialogTitle>
                  <DialogDescription>
                    Skipping today resets a 34-day run. This is the part that matters.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="secondary">Keep going</Button>
                  <Button variant="crimson">Skip today</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="secondary" onClick={() => toast.success("Checked in for today.")}>
              Success toast
            </Button>
            <Button variant="secondary" onClick={() => toast.error("Check-in failed.")}>
              Error toast
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <EmptyState
              title="No goals yet"
              description="Set one measurable goal for this month. One is enough to start."
              action={<Button size="sm">Set a goal</Button>}
            />
            <ErrorState onRetry={() => toast("Retrying…")} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <CardSkeleton />
            <ListSkeleton />
          </div>
        </Block>

        <Block title="Disclaimer" eyebrow="Reused everywhere">
          <RiskDisclaimer />
          <RiskDisclaimer variant="inline" />
        </Block>

        <footer className="border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            Phase 0 — design system only. No backend, payments, auth or market data.
          </p>
        </footer>
      </div>
    </main>
  );
}
