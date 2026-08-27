import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/brand/navigation";
import { Logo } from "@/components/brand/logo";
import { RiskDisclaimer } from "@/components/brand/risk-disclaimer";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopBar
        action={
          <div className="flex items-center gap-4">
            <Link
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              to="/about"
            >
              About
            </Link>
            <Link className="text-sm font-semibold text-primary hover:text-primary/80" to="/login">
              Member login
            </Link>
          </div>
        }
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8 lg:py-24">
        <div className="text-center mb-16">
          <p className="eyebrow text-gold">Founding Member Waitlist</p>
          <h1 className="display-hero mt-4 text-balance text-foreground">Join the foundation.</h1>
          <p className="mt-6 mx-auto max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            Secure your place in The 1% Club. Membership checkout will be connected in a future
            phase.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-24">
          <PricingCard
            title="Explorer"
            price="Free"
            description="A taste of the discipline."
            features={["Limited Mind Lab access", "Public community forum", "Weekly newsletter"]}
          />
          <PricingCard
            title="Member"
            price="$49/mo"
            description="The core 1% Club experience."
            highlight
            features={[
              "Full Mind Lab curriculum",
              "Access to Trading Room",
              "Join a Wolf Pack",
              "Daily Accountability tracking",
            ]}
          />
          <PricingCard
            title="Inner Circle"
            price="$199/mo"
            description="Direct guidance and exclusive access."
            features={[
              "Everything in Member",
              "Live Wolf Sessions",
              "Direct Q&A with MindfulWolf",
              "Advanced market analysis",
            ]}
          />
        </div>

        <div className="mb-24">
          <h2 className="text-center font-display text-3xl text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6 max-w-3xl mx-auto">
            <div className="border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground">When will checkout open?</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Membership checkout will be connected in a future phase. Right now, we are building
                the foundation.
              </p>
            </div>
            <div className="border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground">Do you guarantee trading profits?</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                No. We provide education, structure, and accountability. We do not make profit
                guarantees or income claims.
              </p>
            </div>
          </div>
        </div>

        <RiskDisclaimer variant="block" />
      </section>

      <footer className="border-t border-border px-4 py-6 sm:px-8">
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

function PricingCard({
  title,
  price,
  description,
  features,
  highlight = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col border ${highlight ? "border-primary shadow-lg shadow-primary/10" : "border-border"} bg-card p-8`}
    >
      <h3 className="font-display text-2xl text-foreground">{title}</h3>
      <div className="mt-4 flex items-baseline text-5xl font-extrabold text-foreground">
        {price}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{description}</p>
      <ul className="mt-8 space-y-4 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="size-5 text-primary shrink-0" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`mt-8 w-full rounded-md py-3 text-sm font-semibold transition-colors ${highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
      >
        Waitlist
      </button>
    </div>
  );
}
