import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/signup")({ component: SignupPage });
function SignupPage() { const navigate = useNavigate(); const [email, setEmail] = useState(""); return <main className="grain flex min-h-screen items-center justify-center bg-background px-5 py-10"><div className="w-full max-w-md"><Link to="/" className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back home</Link><Logo size="md" /><p className="eyebrow mt-12 text-gold">Founding waitlist</p><h1 className="display-xl mt-4">Make your move.</h1><p className="mt-4 text-muted-foreground">Tell us where to send your invitation when the doors open.</p><form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); if (email) navigate({ to: "/onboarding" }); }}><div className="space-y-2"><Label htmlFor="signup-email">Email address</Label><Input id="signup-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div><div className="space-y-2"><Label htmlFor="signup-name">What should we call you?</Label><Input id="signup-name" required placeholder="Your name" /></div><Button type="submit" size="lg" className="w-full">Join the waitlist <ArrowRight /></Button></form><p className="mt-8 text-center text-sm text-muted-foreground">Already have access? <Link to="/login" className="text-gold hover:underline">Sign in</Link></p></div></main>; }
declare module "@tanstack/react-router" { interface FileRoutesByPath { "/signup": { parentRoute: typeof import("./__root").Route } } }
