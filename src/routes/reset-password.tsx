import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";

const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof newPasswordSchema>;

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(newPasswordSchema) });

  // Supabase sends the user back with a code in the URL fragment (#access_token=...)
  // or as a ?code= query param depending on the flow. The browser client handles
  // the fragment automatically via onAuthStateChange; we just need to wait.
  useEffect(() => {
    const supabase = getBrowserClient();
    const { data: listener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // If no PASSWORD_RECOVERY event arrives within 5 s the link has expired.
    const timer = setTimeout(() => {
      setInitError("This password reset link has expired or is invalid. Please request a new one.");
    }, 5000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setServerError("Could not update your password. Please try again.");
      return;
    }

    setDone(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 2500);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 flex size-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <LockKeyhole className="size-4" />
          </div>
          <p className="eyebrow">The 1% Club</p>
          <CardTitle className="display-md mt-2">Set a new password.</CardTitle>
        </CardHeader>

        <CardContent>
          {done && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2 className="size-10 text-primary" />
              <p className="font-medium">Password updated</p>
              <p className="text-sm text-muted-foreground">Redirecting you to The Den…</p>
            </div>
          )}

          {!done && initError && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <AlertCircle className="size-10 text-destructive" />
              <p className="text-sm text-muted-foreground">{initError}</p>
              <Button variant="outline" onClick={() => navigate({ to: "/login" })}>
                Back to sign in
              </Button>
            </div>
          )}

          {!done && !initError && !ready && (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!done && !initError && ready && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirm-new-password">Confirm new password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your new password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {serverError && (
                <p
                  role="alert"
                  className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive"
                >
                  {serverError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Update password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});
