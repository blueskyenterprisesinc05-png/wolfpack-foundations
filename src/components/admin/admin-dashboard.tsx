import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Download,
  Filter,
  LayoutDashboard,
  Menu,
  RefreshCw,
  Search,
  Settings2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  adminMetrics,
  adminNav,
  adminNotifications,
  activityPoints,
  communityHealth,
  learningPathPerformance,
  recentActivity,
  upcomingSessions,
  type AdminNavItem,
  type RecentActivity,
  type AdminSession,
} from "@/data/admin";

const accentText = {
  gold: "text-gold",
  forest: "text-forest-tint",
  crimson: "text-crimson-tint",
  muted: "text-muted-foreground",
};
const toneDot = { gold: "bg-gold", forest: "bg-forest", crimson: "bg-crimson" };

export function AdminDashboard() {
  const [activeNav, setActiveNav] = useState<AdminNavItem>("Overview");
  const [range, setRange] = useState("7d");
  const [path, setPath] = useState("all");
  const [activityType, setActivityType] = useState("all");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<RecentActivity | null>(null);
  const [selectedSession, setSelectedSession] = useState<AdminSession | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const visibleActivity = useMemo(
    () => recentActivity.filter((item) => activityType === "all" || item.type === activityType),
    [activityType],
  );
  const visibleNotifications = adminNotifications.filter((item) => !dismissed.includes(item.id));

  const runRefresh = () => {
    setLoading(true);
    setShowError(false);
    window.setTimeout(() => {
      setLoading(false);
      toast.success("Dashboard refreshed", { description: "Demo data is up to date." });
    }, 800);
  };

  const selectNav = (item: AdminNavItem) => {
    setActiveNav(item);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-charcoal lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-border px-6">
          <div className="flex size-9 items-center justify-center rounded-sm bg-crimson font-display text-xl text-foreground">
            1%
          </div>
          <div>
            <p className="font-display text-xl leading-none">THE 1% CLUB</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Admin workspace
            </p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Admin navigation">
          {adminNav.map((item, index) => (
            <button
              key={item}
              onClick={() => selectNav(item)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold transition-colors hover:bg-accent",
                activeNav === item ? "bg-accent text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-sm",
                  activeNav === item
                    ? "bg-gold text-obsidian"
                    : "bg-background text-muted-foreground",
                )}
              >
                <NavIcon index={index} />
              </span>
              {item}
              {item !== "Overview" && (
                <span className="ml-auto text-[9px] uppercase tracking-wider text-muted-foreground">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-md bg-background p-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-gold text-sm font-bold text-obsidian">
              MO
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Maya Okafor</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Settings2 className="ml-auto size-4 text-muted-foreground" />
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu />
            </Button>
            <div>
              <p className="eyebrow text-gold">Operations / {activeNav}</p>
              <h1 className="display-lg mt-1">{activeNav}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={runRefresh} loading={loading}>
              <RefreshCw data-icon="inline-start" />
              Refresh
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell />
            </Button>
          </div>
        </header>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <aside
              className="h-full w-72 border-r border-border bg-charcoal p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="font-display text-2xl">THE 1% CLUB</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                >
                  <X />
                </Button>
              </div>
              <nav className="flex flex-col gap-1">
                {adminNav.map((item) => (
                  <button
                    key={item}
                    onClick={() => selectNav(item)}
                    className={cn(
                      "rounded-md px-3 py-3 text-left text-sm font-semibold",
                      activeNav === item ? "bg-accent" : "text-muted-foreground",
                    )}
                  >
                    {item}
                    {item !== "Overview" && (
                      <span className="float-right text-[9px] uppercase text-muted-foreground">
                        Soon
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {activeNav !== "Overview" ? (
            <FuturePhase item={activeNav} onBack={() => setActiveNav("Overview")} />
          ) : (
            <>
              <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
                <div>
                  <p className="eyebrow text-muted-foreground">Tuesday, March 11, 2025</p>
                  <h2 className="display-xl mt-2 text-balance">Good morning, Maya.</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    A clear view of what is moving through The 1% Club today.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={range} onValueChange={setRange}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() =>
                      toast.success("Export simulation ready", {
                        description: "No file was created. This is a visual-only demo.",
                      })
                    }
                  >
                    <Download data-icon="inline-start" />
                    Export view
                  </Button>
                </div>
              </div>
              {showError && (
                <div className="mb-5 flex items-center justify-between rounded-md border border-crimson/40 bg-crimson/10 p-3 text-sm">
                  <span className="flex items-center gap-2 text-crimson-tint">
                    <CircleAlert className="size-4" />
                    Some demo data could not be loaded.
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setShowError(false)}>
                    Retry
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                {loading
                  ? Array.from({ length: 7 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 rounded-none" />
                    ))
                  : adminMetrics.map((metric) => (
                      <div key={metric.id} className="bg-charcoal p-4">
                        <p className="text-xs leading-5 text-muted-foreground">{metric.label}</p>
                        <p className="display-stat mt-3">{metric.value}</p>
                        <p className={cn("mt-2 text-xs font-semibold", accentText[metric.accent])}>
                          {metric.trend === "up" ? "↗ " : ""}
                          {metric.change}
                        </p>
                      </div>
                    ))}
              </div>
              <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                <Card>
                  <CardHeader className="flex-row items-start justify-between">
                    <div>
                      <CardTitle>Member activity</CardTitle>
                      <CardDescription>Participation and weekly check-ins</CardDescription>
                    </div>
                    <Select value={path} onValueChange={setPath}>
                      <SelectTrigger className="w-40">
                        <Filter className="mr-2 size-4" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All paths</SelectItem>
                        <SelectItem value="mind-lab">Mind Lab</SelectItem>
                        <SelectItem value="trading-room">Trading Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full">
                      {loading ? (
                        <Skeleton className="size-full" />
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activityPoints}>
                            <defs>
                              <linearGradient id="memberFill" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                  offset="0%"
                                  stopColor="var(--color-chart-1)"
                                  stopOpacity={0.35}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="var(--color-chart-1)"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="var(--color-border)" vertical={false} />
                            <XAxis
                              dataKey="label"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                            />
                            <YAxis hide />
                            <Tooltip
                              contentStyle={{
                                background: "var(--color-charcoal)",
                                border: "1px solid var(--color-border)",
                                borderRadius: 6,
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="members"
                              stroke="var(--color-chart-1)"
                              fill="url(#memberFill)"
                              strokeWidth={2}
                            />
                            <Area
                              type="monotone"
                              dataKey="checkIns"
                              stroke="var(--color-chart-2)"
                              fill="transparent"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="mt-3 flex gap-5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <i className="size-2 rounded-full bg-gold" />
                        Active members
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="size-2 rounded-full bg-forest" />
                        Check-ins
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Learning performance</CardTitle>
                    <CardDescription>Completion by path</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    {learningPathPerformance.map((item) => (
                      <div key={item.id}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-gold">{item.completion}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-background">
                          <div
                            className="h-full rounded-full bg-gold transition-all"
                            style={{ width: `${item.completion}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <span>{item.enrolled.toLocaleString()} enrolled</span>
                          <span className="text-forest-tint">{item.momentum}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <Card>
                  <CardHeader className="flex-row items-start justify-between">
                    <div>
                      <CardTitle>Recent member activity</CardTitle>
                      <CardDescription>Review what is happening across the club</CardDescription>
                    </div>
                    <Select value={activityType} onValueChange={setActivityType}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All activity</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="check-in">Check-ins</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {visibleActivity.length === 0 ? (
                        <EmptyState label="No activity matches this filter." />
                      ) : (
                        visibleActivity.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedActivity(item)}
                            className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent"
                          >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-gold">
                              {item.initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold">
                                {item.member}{" "}
                                <span className="font-normal text-muted-foreground">
                                  {item.action.toLowerCase()}
                                </span>
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {item.detail}
                              </p>
                            </div>
                            <div className="hidden text-right sm:block">
                              <p className="text-xs text-muted-foreground">{item.time}</p>
                              <Badge
                                variant={
                                  reviewed.includes(item.id) || item.status === "Reviewed"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {reviewed.includes(item.id) || item.status === "Reviewed"
                                  ? "Reviewed"
                                  : "Review"}
                              </Badge>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </button>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Wolf Sessions</CardTitle>
                    <CardDescription>Capacity and facilitator schedule</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {upcomingSessions.length === 0 ? (
                      <EmptyState label="No sessions scheduled." />
                    ) : (
                      upcomingSessions.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => setSelectedSession(session)}
                          className="rounded-md border border-border bg-background p-4 text-left transition-colors hover:border-gold/50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{session.title}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {session.date} · {session.time}
                              </p>
                            </div>
                            <Badge variant={session.status === "Open" ? "secondary" : "outline"}>
                              {session.status}
                            </Badge>
                          </div>
                          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-2">
                              <CalendarDays className="size-3" />
                              {session.host}
                            </span>
                            <span>
                              {session.attendees}/{session.capacity} seats
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Community health</CardTitle>
                    <CardDescription>Signals from the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    {communityHealth.map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full bg-secondary",
                            accentText[item.tone],
                          )}
                        >
                          <Activity className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-3 text-sm">
                            <span className="font-semibold">{item.label}</span>
                            <span className={accentText[item.tone]}>{item.value}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Items requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {visibleNotifications.length === 0 ? (
                      <EmptyState label="All caught up." />
                    ) : (
                      visibleNotifications.map((item) => (
                        <div key={item.id} className="flex gap-3 rounded-md p-3 hover:bg-accent">
                          <span
                            className={cn("mt-1 size-2 shrink-0 rounded-full", toneDot[item.tone])}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.detail}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">{item.time}</p>
                          </div>
                          <button
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setDismissed((current) => [...current, item.id]);
                              toast.success("Notification dismissed");
                            }}
                            aria-label={`Dismiss ${item.title}`}
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-gold text-obsidian">
                  <CardHeader>
                    <CardTitle className="text-obsidian">Keep the signal clear.</CardTitle>
                    <CardDescription className="text-obsidian/70">
                      Review new member activity and keep the community moving with intention.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setActivityType("all");
                        toast.success("Review queue opened");
                      }}
                    >
                      Open review queue <ChevronRight data-icon="inline-end" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activity detail</DialogTitle>
            <DialogDescription>Frontend-only member activity record.</DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-lg font-semibold">{selectedActivity.member}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedActivity.action} · {selectedActivity.time}
                </p>
              </div>
              <div className="rounded-md bg-secondary p-4 text-sm leading-6">
                {selectedActivity.detail}
              </div>
              <Button
                variant="gold"
                onClick={() => {
                  setReviewed((current) => [...new Set([...current, selectedActivity.id])]);
                  setSelectedActivity(null);
                  toast.success("Activity marked reviewed");
                }}
              >
                <Check data-icon="inline-start" />
                Mark as reviewed
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
            <DialogDescription>Upcoming Wolf Session details</DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">When</p>
                  <p className="mt-1 font-semibold">{selectedSession.date}</p>
                  <p className="text-muted-foreground">{selectedSession.time}</p>
                </div>
                <div className="rounded-md bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Seats</p>
                  <p className="mt-1 font-semibold">
                    {selectedSession.attendees} / {selectedSession.capacity}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Hosted by{" "}
                <span className="font-semibold text-foreground">{selectedSession.host}</span>. This
                scheduling view is a realistic demo with no live bookings.
              </p>
              <Button variant="outline" onClick={() => setSelectedSession(null)}>
                Close details
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center p-6 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
function FuturePhase({ item, onBack }: { item: AdminNavItem; onBack: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-secondary text-gold">
          <LayoutDashboard />
        </div>
        <p className="eyebrow text-gold">Future phase</p>
        <h2 className="display-xl mt-3">{item}</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          This operational area is mapped into the admin workspace and will be available in a future
          phase. Overview is the only live admin surface in this release.
        </p>
        <Button className="mt-6" variant="gold" onClick={onBack}>
          Return to overview
        </Button>
      </div>
    </div>
  );
}
function NavIcon({ index }: { index: number }) {
  const icons = [LayoutDashboard, Users, Activity, CalendarDays, Bell, Search, Settings2];
  const Icon = icons[index] ?? LayoutDashboard;
  return <Icon />;
}
