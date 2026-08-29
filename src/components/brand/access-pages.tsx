import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { signInWithEmailFn, signUpFn, requestPasswordResetFn } from "@/lib/auth";
import { completeOnboardingFn } from "@/lib/profile";

// ── Schemas ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const onboardingSchema = z.object({
  display_name: z.string().min(1, "Display name is required."),
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters.")
    .max(30, "Handle must be at most 30 characters.")
    .regex(
      /^[a-z0-9_]{3,30}$/,
      "Handle can only contain lowercase letters, numbers, and underscores.",
    ),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;
type ResetValues = z.infer<typeof resetSchema>;
type OnboardingValues = z.infer<typeof onboardingSchema>;

// ── Sub-views ─────────────────────────────────────────────────────────────────

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    const result = await signInWithEmailFn({ data: values });
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    await navigate({ to: "/dashboard" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      {serverError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <ArrowRight className="mr-2 size-4" />
        )}
        Sign in
      </Button>

      <button
        type="button"
        onClick={onForgot}
        className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Forgot password?
      </button>
    </form>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupValues) => {
    setServerError(null);
    const result = await signUpFn({
      data: { email: values.email, password: values.password },
    });

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setConfirming(true);
      return;
    }

    // Email confirmation disabled — immediate session.
    await navigate({ to: "/onboarding" });
  };

  if (confirming) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-medium">Check your email</p>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to your inbox. Click it to activate your account, then return
          here to sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="signup-confirm">Confirm password</Label>
        <Input
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <ArrowRight className="mr-2 size-4" />
        )}
        Create account
      </Button>
    </form>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  const onSubmit = async (values: ResetValues) => {
    await requestPasswordResetFn({ data: values });
    // Always show success to prevent user enumeration.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-medium">Reset link sent</p>
        <p className="text-sm text-muted-foreground">
          If an account exists for that email, you'll receive a reset link shortly.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="text-sm text-muted-foreground">
        Enter the email address for your account and we'll send you a reset link.
      </p>
      <div className="space-y-1">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <ArrowRight className="mr-2 size-4" />
        )}
        Send reset link
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Back to sign in
      </button>
    </form>
  );
}

function OnboardingForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingValues>({ resolver: zodResolver(onboardingSchema) });

  const onSubmit = async (values: OnboardingValues) => {
    setServerError(null);
    const result = await completeOnboardingFn({ data: values });
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    // Refresh to reload context with new profile, or just navigate to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <Label htmlFor="onboarding-display-name">Display name</Label>
        <Input
          id="onboarding-display-name"
          type="text"
          placeholder="e.g. Alex"
          {...register("display_name")}
        />
        {errors.display_name && (
          <p className="text-xs text-destructive">{errors.display_name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="onboarding-handle">Handle</Label>
        <Input
          id="onboarding-handle"
          type="text"
          placeholder="e.g. alex_1"
          {...register("handle")}
        />
        {errors.handle && <p className="text-xs text-destructive">{errors.handle.message}</p>}
      </div>

      {serverError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <ArrowRight className="mr-2 size-4" />
        )}
        Complete profile
      </Button>
    </form>
  );
}

// ── Public AccessPage component ────────────────────────────────────────────────

type View = "login" | "signup" | "forgot" | "onboarding";

export function AccessPage({ kind }: { kind: "login" | "signup" | "onboarding" }) {
  const [view, setView] = useState<View>(
    kind === "signup" ? "signup" : kind === "onboarding" ? "onboarding" : "login",
  );

  const heading =
    view === "signup"
      ? "Join The 1% Club."
      : view === "forgot"
        ? "Reset your password."
        : view === "onboarding"
          ? "Set up your profile."
          : "Welcome back.";

  const subheading =
    view === "signup"
      ? "Start with one honest commitment and build from there."
      : view === "forgot"
        ? "We'll send a link to your email address."
        : view === "onboarding"
          ? "Choose how you'll appear in The Den."
          : "Return to the practice you are building.";

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 flex size-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <LockKeyhole className="size-4" />
          </div>
          <p className="eyebrow">The 1% Club</p>
          <CardTitle className="display-md mt-2">{heading}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">{subheading}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {view === "login" && <LoginForm onForgot={() => setView("forgot")} />}
          {view === "signup" && <SignupForm />}
          {view === "forgot" && <ForgotPasswordForm onBack={() => setView("login")} />}
          {view === "onboarding" && <OnboardingForm />}

          {view !== "forgot" && view !== "onboarding" && (
            <p className="text-center text-xs text-muted-foreground">
              {view === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("signup")}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
