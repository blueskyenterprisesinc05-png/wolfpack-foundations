import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/brand/navigation";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopBar
        action={
          <div className="flex items-center gap-4">
            <Link
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              to="/pricing"
            >
              Pricing
            </Link>
            <Link className="text-sm font-semibold text-primary hover:text-primary/80" to="/login">
              Member login
            </Link>
          </div>
        }
      />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:py-24">
        <div className="text-center mb-16">
          <p className="eyebrow">About The 1% Club</p>
          <h1 className="display-hero mt-4 text-balance text-foreground">
            MindfulWolf inspires the change. The 1% Club creates the system for living it.
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            We are a discipline-first community dedicated to the philosophy of becoming 1% better
            every day. We believe that consistent, compounding effort beats raw talent over time.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="border border-border bg-card p-8">
            <h2 className="font-display text-2xl text-foreground mb-4">Core Values</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✦</span> Discipline
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✦</span> Emotional Mastery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✦</span> Accountability
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✦</span> Consistent Learning
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✦</span> Integrity
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✦</span> Contribution
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-display text-xl text-foreground">Mind Lab</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Our core personal-growth path. A structured curriculum designed to build mental
                fortitude and emotional resilience.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-foreground">Trading Room</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                One practical skills path within the club. Learn risk management, strategy, and
                execution without the hype.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-foreground">Wolf Packs</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Accountability groups that keep you honest. Check in, reflect, and stay committed to
                your daily actions with peers who demand your best.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-6 sm:px-8 mt-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo size="sm" />
          <div className="flex gap-4">
            <Link className="text-sm text-muted-foreground hover:text-foreground" to="/pricing">
              Pricing
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" to="/about">
              About
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
