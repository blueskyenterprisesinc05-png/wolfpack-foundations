import { Link } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccessPage({ kind }: { kind: "login" | "signup" | "onboarding" }) {
  const copy =
    kind === "login"
      ? ["Welcome back.", "Return to the practice you are building."]
      : kind === "signup"
        ? ["Join The 1% Club.", "Start with one honest commitment and build from there."]
        : ["Set your direction.", "Choose the practice that deserves your attention first."];
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 flex size-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <LockKeyhole className="size-4" />
          </div>
          <p className="eyebrow">The 1% Club</p>
          <CardTitle className="display-md mt-2">{copy[0]}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">{copy[1]}</p>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link to="/dashboard">
              Continue to The Den
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Frontend preview route. Authentication is intentionally not enabled.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
