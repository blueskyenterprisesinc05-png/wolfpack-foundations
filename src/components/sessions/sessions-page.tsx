import { useMemo, useState } from "react";
import { CalendarPlus, Check, Clock3, FileText, Play, Search, Users, X } from "lucide-react";
import { TopBar } from "@/components/brand/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockAttendance, mockSessions, sessionCategories, sessionHosts } from "@/data/sessions";
import type { Session, SessionAttendance, SessionCategory } from "@/types";

const statusFilters = ["All sessions", "Upcoming", "Past", "Registered"] as const;
type StatusFilter = (typeof statusFilters)[number];

function Host({ id }: { id: string }) {
  const host = sessionHosts.find((item) => item.id === id)!;
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-full bg-secondary font-mono text-[10px] font-bold text-gold">
        {host.initials}
      </span>
      <span>
        <span className="block text-sm font-semibold">{host.name}</span>
        <span className="block text-xs text-muted-foreground">{host.role}</span>
      </span>
    </div>
  );
}

export function SessionsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SessionCategory | "All categories">("All categories");
  const [status, setStatus] = useState<StatusFilter>("All sessions");
  const [sort, setSort] = useState("Soonest");
  const [selected, setSelected] = useState<Session | null>(null);
  const [attendance, setAttendance] = useState<SessionAttendance[]>(mockAttendance);
  const [toast, setToast] = useState("");
  const [loading] = useState(false);
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return mockSessions
      .filter((s) => {
        const matchesQuery =
          !q ||
          [
            s.title,
            s.description,
            s.category,
            sessionHosts.find((h) => h.id === s.hostId)?.name,
          ].some((value) => value?.toLowerCase().includes(q));
        const matchesCategory = category === "All categories" || s.category === category;
        const registered = attendance.some(
          (a) => a.sessionId === s.id && a.status === "registered",
        );
        const matchesStatus =
          status === "All sessions" ||
          (status === "Upcoming" && s.status === "upcoming") ||
          (status === "Past" && s.status === "past") ||
          (status === "Registered" && registered);
        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) =>
        sort === "Most popular"
          ? b.attendeeCount - a.attendeeCount
          : sort === "Recently added"
            ? b.id.localeCompare(a.id)
            : (a.status === "past" ? 1 : 0) - (b.status === "past" ? 1 : 0) ||
              a.dateValue - b.dateValue,
      );
  }, [attendance, category, query, sort, status]);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const isRegistered = (id: string) =>
    attendance.some((a) => a.sessionId === id && a.status === "registered");
  const attend = (session: Session) => {
    if (session.status === "full" && !isRegistered(session.id))
      return notify("This session is currently full.");
    const next = isRegistered(session.id)
      ? attendance.map((a) =>
          a.sessionId === session.id
            ? { ...a, status: "cancelled" as const, addedToSchedule: false }
            : a,
        )
      : [
          ...attendance.filter((a) => a.sessionId !== session.id),
          { sessionId: session.id, status: "registered" as const, addedToSchedule: true },
        ];
    setAttendance(next);
    notify(
      isRegistered(session.id)
        ? "You have been removed from this session."
        : "You are registered for this Wolf Session.",
    );
  };
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8 flex flex-col gap-5 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              The Den / Wolf Sessions
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Learn together. Ask better questions. Keep moving forward.
            </h1>
            <p className="mt-3 max-w-2xl text-pretty leading-6 text-muted-foreground">
              Small rooms for honest reflection, practical teaching, and the kind of accountability
              that compounds.
            </p>
          </div>
          <div className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
            <span className="block font-semibold">Next up</span>
            <span>Emotional Control Under Pressure · Today</span>
          </div>
        </header>
        <section className="mb-8 flex flex-col gap-3 rounded-xl border border-border bg-charcoal p-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sessions, hosts, or topics"
              className="pl-9"
              aria-label="Search sessions"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>All sessions</option>
            <option>Upcoming</option>
            <option>Past</option>
            <option>Registered</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SessionCategory | "All categories")}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>All categories</option>
            {sessionCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>Soonest</option>
            <option>Most popular</option>
            <option>Recently added</option>
          </select>
        </section>
        <div className="mb-8 flex flex-wrap gap-2">
          {statusFilters.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={status === item ? "default" : "outline"}
              onClick={() => setStatus(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        {loading ? (
          <div className="rounded-xl border border-border bg-charcoal p-12 text-center text-muted-foreground">
            Loading Wolf Sessions…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-charcoal p-12 text-center">
            <h2 className="font-display text-2xl font-semibold">No sessions found</h2>
            <p className="mt-2 text-muted-foreground">
              Try a different search or clear one of your filters.
            </p>
            <Button
              className="mt-5"
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("All categories");
                setStatus("All sessions");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 mb-2">
              <h2 className="font-display text-2xl font-semibold">
                {status === "Past" ? "Past sessions" : "Upcoming sessions"}
              </h2>
            </div>
            {filtered.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                registered={isRegistered(session.id)}
                onAttend={() => attend(session)}
                onDetails={() => setSelected(session)}
              />
            ))}
          </section>
        )}
        {toast ? (
          <div
            role="status"
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-forest/50 bg-charcoal px-4 py-3 text-sm font-semibold text-foreground shadow-lg"
          >
            {toast}
          </div>
        ) : null}
        {selected ? (
          <SessionDialog
            session={selected}
            registered={isRegistered(selected.id)}
            onAttend={() => attend(selected)}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </main>
    </div>
  );
}

function SessionCard({
  session,
  registered,
  onAttend,
  onDetails,
}: {
  session: Session;
  registered: boolean;
  onAttend: () => void;
  onDetails: () => void;
}) {
  const safety =
    session.category === "Trading Psychology" || session.category === "Risk Management";
  return (
    <Card className="flex flex-col border-border bg-charcoal">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <Badge variant={session.status === "past" ? "secondary" : "outline"}>
            {session.category}
          </Badge>
          {session.recordingAvailable ? (
            <span className="flex items-center gap-1 text-xs text-gold">
              <Play className="size-3" />
              Recording
            </span>
          ) : null}
        </div>
        <CardTitle className="font-display text-2xl leading-tight">{session.title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{session.description}</p>
      </CardHeader>
      <CardContent className="mt-auto space-y-5">
        <Host id={session.hostId} />
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <Clock3 className="size-4 text-gold" />
            {session.dateLabel}
            <br />
            {session.timeLabel}
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4 text-gold" />
            {session.attendeeCount}/{session.capacity} attending
          </span>
        </div>
        {safety ? (
          <p className="border-l-2 border-gold/70 pl-3 text-xs leading-5 text-muted-foreground">
            Educational only. No guaranteed profits, personal investment advice, or trade execution.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            className="flex-1"
            variant={registered ? "secondary" : "default"}
            disabled={session.status === "past" || (session.status === "full" && !registered)}
            onClick={onAttend}
          >
            {registered ? (
              <>
                <Check className="mr-2 size-4" />
                Registered
              </>
            ) : session.status === "full" ? (
              "Session full"
            ) : session.status === "past" ? (
              "Past session"
            ) : (
              "Attend"
            )}
          </Button>
          <Button variant="outline" onClick={onDetails}>
            View details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SessionDialog({
  session,
  registered,
  onAttend,
  onClose,
}: {
  session: Session;
  registered: boolean;
  onAttend: () => void;
  onClose: () => void;
}) {
  const host = sessionHosts.find((item) => item.id === session.hostId)!;
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-dialog-title"
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-charcoal p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
              {session.category}
            </p>
            <h2 id="session-dialog-title" className="mt-2 font-display text-3xl font-semibold">
              {session.title}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close session details">
            <X />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Host id={session.hostId} />
          <div className="text-sm text-muted-foreground">
            {session.dateLabel}
            <br />
            {session.timeLabel} · {session.durationMinutes} minutes
          </div>
        </div>
        <p className="mt-6 leading-7 text-muted-foreground">{session.fullDescription}</p>
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold">What members will learn</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {session.learningPoints.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-forest" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Preparation checklist</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {session.preparation.map((item) => (
                <li key={item} className="flex gap-2">
                  <FileText className="mt-0.5 size-4 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {session.recordingAvailable
              ? "Recording available after the session."
              : "No recording is currently planned."}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              disabled={session.status === "past" || (session.status === "full" && !registered)}
              variant={registered ? "secondary" : "default"}
              onClick={onAttend}
            >
              {registered
                ? "Cancel attendance"
                : session.status === "full"
                  ? "Session full"
                  : "Attend session"}
              <CalendarPlus className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
