import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Target, Users } from "lucide-react";
import { TopBar } from "@/components/brand/navigation";
import { Logo } from "@/components/brand/logo";
import { RiskDisclaimer } from "@/components/brand/risk-disclaimer";

export function PublicLanding() {
  return (
    <main className="min-h-screen bg-background">
      <TopBar
        action={
          <Link className="text-sm font-semibold text-primary hover:text-primary/80" to="/login">
            Member login
          </Link>
        }
      />
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-8 lg:flex-row lg:items-center lg:py-24">
        <div className="max-w-3xl flex-1">
          <p className="eyebrow">The 1% Club</p>
          <h1 className="display-hero mt-4 text-balance text-foreground">
            Become 1% better every day.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            A discipline-first membership for traders and builders who want structure, honest
            progress, and a community that shows up.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground hover:opacity-90"
              to="/signup"
            >
              Join the club <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              className="inline-flex h-11 items-center rounded-md border border-border px-5 font-semibold text-foreground hover:bg-secondary"
              to="/community"
            >
              Explore The Pack
            </Link>
          </div>
        </div>
        <div className="grid flex-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            [
              Target,
              "Practice",
              "Structured Mind Lab lessons that turn intention into repeatable action.",
            ],
            [
              Users,
              "Accountability",
              "Visible commitments and a calm community built around follow-through.",
            ],
            [
              ShieldCheck,
              "Process",
              "Trading education grounded in risk awareness, review, and no promises.",
            ],
          ].map(([Icon, title, body]) => {
            const Mark = Icon as typeof Target;
            return (
              <div key={title as string} className="border border-border bg-card p-5">
                <Mark className="size-5 text-primary" />
                <h2 className="mt-4 font-display text-xl text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-8">
        <RiskDisclaimer variant="block" />
      </section>
      <footer className="border-t border-border px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo size="sm" />
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/styleguide">
            View styleguide
          </Link>
        </div>
      </footer>
    </main>
  );
}
