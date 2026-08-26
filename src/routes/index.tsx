import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";
import { BRAND } from "@/data/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND.name} — ${BRAND.tagline}` },
      { name: "description", content: "A private operating system for people building wealth, discipline, and a life of intention." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Logo size="sm" />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Primary navigation">
          <a href="#method" className="transition-colors hover:text-foreground">The method</a>
          <a href="#inside" className="transition-colors hover:text-foreground">Inside the club</a>
          <a href="#membership" className="transition-colors hover:text-foreground">Membership</a>
        </nav>
        <Link to="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow mb-5 flex items-center gap-2 text-gold"><Sparkles className="h-4 w-4" /> Private membership for uncommon lives</p>
          <h1 className="display-hero text-balance text-foreground">Become 1% better every day.</h1>
          <p className="body-lg mt-7 max-w-lg text-pretty text-muted-foreground">The 1% Club is a private operating system for people who refuse to leave their future to chance.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup"><Button size="lg" className="w-full sm:w-auto">Request access <ArrowRight /></Button></Link>
            <a href="#method"><Button variant="ghost" size="lg" className="w-full sm:w-auto">See the method</Button></a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground"><span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-gold" /> Private by design</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-forest" /> Built for consistency</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-8 rounded-full bg-crimson/10 blur-3xl" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-charcoal shadow-elevated">
            <img src={BRAND.markUrl} alt="The 1% Club wolf mark" className="h-full w-full object-cover opacity-75 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6"><p className="eyebrow text-gold">The den</p><p className="mt-2 font-display text-4xl uppercase leading-none text-foreground">Discipline compounds.</p></div>
          </div>
        </div>
      </section>

      <section id="method" className="border-y border-border bg-charcoal/60 px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><p className="eyebrow text-crimson-tint">The method</p><h2 className="display-xl mt-4 max-w-xl">Small moves. Serious momentum.</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{[{ title: "Know your numbers", text: "Turn financial fog into a clear next move." }, { title: "Build your edge", text: "Practice the skills that make opportunity inevitable." }, { title: "Keep your word", text: "Track the daily promises that compound into identity." }].map((item, index) => <Card key={item.title} variant="bordered"><CardContent className="p-6"><p className="font-mono text-sm text-gold">0{index + 1}</p><h3 className="mt-8 text-xl">{item.title}</h3><p className="mt-3 text-muted-foreground">{item.text}</p></CardContent></Card>)}</div></div></section>

      <section id="inside" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow text-gold">Inside the club</p><h2 className="display-xl mt-4">Your next 1% is waiting.</h2></div><div className="grid gap-3 sm:grid-cols-2"><Feature text="Daily lessons and field notes" /><Feature text="A private progress dashboard" /><Feature text="Practical wealth-building tracks" /><Feature text="A room full of people doing the work" /></div></div></section>

      <section id="membership" className="bg-crimson px-5 py-20 text-primary-foreground sm:px-8 lg:px-12"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow text-primary-foreground/70">Membership</p><h2 className="display-xl mt-4">The door opens soon.</h2><p className="body-lg mt-4 max-w-xl text-primary-foreground/80">Founding membership is currently invite-only. Join the list for first access.</p></div><Link to="/signup"><Button variant="secondary" size="lg">Join the waitlist <ArrowRight /></Button></Link></div></section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><Logo size="sm" /><span>© 2026 The 1% Club. Build deliberately.</span></footer>
    </main>
  );
}

function Feature({ text }: { text: string }) { return <div className="flex items-center gap-3 border-b border-border py-4 text-sm"><Check className="h-4 w-4 shrink-0 text-forest" />{text}</div>; }

declare module "@tanstack/react-router" { interface FileRoutesByPath { "/": { parentRoute: typeof import("./__root").Route } } }
