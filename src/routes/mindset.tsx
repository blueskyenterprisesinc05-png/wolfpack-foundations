import { createFileRoute } from "@tanstack/react-router";
import { Brain, ArrowRight } from "lucide-react";
import { MemberShell } from "@/components/brand/member-shell";
import { CourseGrid } from "@/components/brand/course-grid";
import { mindLabCourses } from "@/data/member";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/mindset")({ component: MindsetPage });
function MindsetPage() { return <MemberShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:py-12"><div className="flex flex-col gap-8"><header><p className="eyebrow text-gold">The 1% Club · Personal growth</p><h1 className="display-xl mt-3">Mind Lab</h1><p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">Build the inner discipline required to handle the outer world.</p></header><Card variant="gold"><CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div className="flex items-start gap-4"><Brain className="mt-1 size-6 shrink-0 text-gold" /><div><p className="eyebrow text-gold">Featured course</p><h2 className="mt-2 font-body text-xl font-semibold">Mastering Your Emotional State</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Learn to recognise emotional triggers, slow down impulsive reactions, and make decisions that reflect your values.</p></div></div><Button variant="gold">Start course <ArrowRight /></Button></CardContent></Card><div><p className="eyebrow text-muted-foreground">Your curriculum</p><h2 className="display-md mt-2">Choose your next practice</h2></div><CourseGrid courses={mindLabCourses} /></div></div></MemberShell>; }
