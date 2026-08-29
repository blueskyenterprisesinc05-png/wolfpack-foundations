import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/rls-test")({
  beforeLoad: ({ context }) => {
    if (!import.meta.env.DEV) {
      throw redirect({ to: "/" });
    }
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: RlsTestScreen,
});

interface TestResult {
  name: string;
  status: "pending" | "pass" | "fail";
  message: string;
}

function RlsTestScreen() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [criticalFailure, setCriticalFailure] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setCriticalFailure(false);

    const supabase = getBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setResults([{ name: "Auth Check", status: "fail", message: "No user found" }]);
      setIsRunning(false);
      return;
    }

    const newResults: TestResult[] = [];
    const updateResult = (res: TestResult) => {
      newResults.push(res);
      setResults([...newResults]);
    };

    // 1. Read current user's membership
    try {
      const { data, error } = await supabase
        .from("memberships")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) {
        updateResult({ name: "Read Own Membership", status: "fail", message: error.message });
      } else {
        updateResult({ name: "Read Own Membership", status: "pass", message: `Allowed (Returned ${data?.length} rows)` });
      }
    } catch (e: any) {
      updateResult({ name: "Read Own Membership", status: "fail", message: e.message });
    }

    // 2. Read another user's membership
    try {
      const dummyId = "00000000-0000-0000-0000-000000000000";
      const { data, error } = await supabase
        .from("memberships")
        .select("*")
        .eq("user_id", dummyId);
      
      if (error) {
        updateResult({ name: "Read Other Membership", status: "fail", message: error.message });
      } else if (data && data.length > 0) {
        updateResult({ name: "Read Other Membership", status: "fail", message: "Security risk: Was able to read another user's rows." });
      } else {
        updateResult({ name: "Read Other Membership", status: "pass", message: "Allowed but correctly returned 0 rows (Filtered by RLS)" });
      }
    } catch (e: any) {
      updateResult({ name: "Read Other Membership", status: "fail", message: e.message });
    }

    // 3. Unauthorized insert
    try {
      // Need a valid UUID for plan_id to satisfy foreign key, assuming one exists or just use a dummy one.
      // If FK fails first, it's fine, but RLS usually fails before FK if policies block it.
      const dummyPlanId = "11111111-1111-1111-1111-111111111111";
      const { data, error } = await supabase
        .from("memberships")
        .insert({
          user_id: user.id,
          plan_id: dummyPlanId,
          status: "active"
        })
        .select();

      if (error) {
        updateResult({ name: "Unauthorized Insert", status: "pass", message: `Blocked by RLS as expected. Error: ${error.message}` });
      } else {
        updateResult({ name: "Unauthorized Insert", status: "fail", message: "CRITICAL: Insert unexpectedly succeeded!" });
        setCriticalFailure(true);
        setIsRunning(false);
        return; // STOP IMMEDIATELY
      }
    } catch (e: any) {
      updateResult({ name: "Unauthorized Insert", status: "pass", message: `Blocked by RLS as expected. Error: ${e.message}` });
    }

    // 4. Unauthorized update
    try {
      const { data, error } = await supabase
        .from("memberships")
        .update({ status: "cancelled" })
        .eq("user_id", user.id)
        .select();

      if (error) {
        updateResult({ name: "Unauthorized Update", status: "pass", message: `Blocked by RLS as expected. Error: ${error.message}` });
      } else if (data && data.length > 0) {
        updateResult({ name: "Unauthorized Update", status: "fail", message: "CRITICAL: Update unexpectedly succeeded!" });
        setCriticalFailure(true);
        setIsRunning(false);
        return; // STOP IMMEDIATELY
      } else {
        updateResult({ name: "Unauthorized Update", status: "pass", message: "Blocked by RLS as expected (Returned 0 rows updated)." });
      }
    } catch (e: any) {
      updateResult({ name: "Unauthorized Update", status: "pass", message: `Blocked by RLS as expected. Error: ${e.message}` });
    }

    setIsRunning(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-amber-500" />
            Temporary RLS Verification Screen
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Development only. Tests the active user session against database RLS policies.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {criticalFailure && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20 font-medium">
              CRITICAL FAILURE: A destructive write unexpectedly succeeded. Test sequence halted to prevent further modifications.
            </div>
          )}

          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className={`p-4 rounded-md border ${r.status === 'pass' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {r.status === 'pass' ? <ShieldCheck className="size-4" /> : <ShieldAlert className="size-4" />}
                  {r.name} - {r.status.toUpperCase()}
                </div>
                <p className="text-sm opacity-90">{r.message}</p>
              </div>
            ))}
          </div>

          <Button 
            onClick={runTests} 
            disabled={isRunning || criticalFailure}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Running Tests...
              </>
            ) : (
              "Run RLS Tests"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
