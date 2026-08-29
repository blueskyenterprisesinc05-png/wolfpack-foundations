import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/courses/")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: () => (
    <AppShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="border-b border-border pb-8">
          <p className="eyebrow">Learning Center</p>
          <h1 className="display-xl mt-3 text-foreground">Paths</h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
            Learning center redesign coming in Phase 3.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>
              <CardTitle className="mt-4">Mind Lab</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground mb-6">
                Train the part that chooses.
              </p>
              <Link
                to="/courses/$courseId"
                params={{ courseId: "mind-lab" }}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Open Path
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>
              <CardTitle className="mt-4">Trading Room</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground mb-6">
                Process over prediction.
              </p>
              <Link
                to="/courses/$courseId"
                params={{ courseId: "trading-room" }}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Open Path
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  ),
});
