import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase/server";
import type { MembershipTier } from "../types";

export const EXPLORER_TIER: MembershipTier = "free";

const tierSchema = z.enum(["free", "member", "inner-circle"]).catch(EXPLORER_TIER);

/**
 * Resolves the authenticated user's current membership tier.
 * Never trusts the client. Always queries the database using auth.uid().
 * If multiple active memberships exist, it deterministically picks the newest one.
 * Fails closed to EXPLORER_TIER ("free") if no active membership is found, 
 * or if the tier is unknown/invalid.
 */
export const getCurrentEntitlementFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ tier: MembershipTier }> => {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { tier: EXPLORER_TIER };
    }

    const nowISO = new Date().toISOString();

    // Query active memberships for the user.
    // Deterministic resolution: order by created_at descending and take the first one.
    // We check that status is 'active' or 'trial' and expires_at is either null or in the future.
    const { data: rows, error } = await supabase
      .from("memberships")
      .select("status, expires_at, membership_plans(tier)")
      .eq("user_id", user.id)
      .in("status", ["active", "trial"])
      .or(`expires_at.is.null,expires_at.gt.${nowISO}`)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !rows || rows.length === 0) {
      return { tier: EXPLORER_TIER };
    }

    const membership = rows[0]!;
    
    // Extract tier safely (Supabase joins return an array if it's a one-to-many, 
    // or an object if it's a many-to-one foreign key. Since memberships.plan_id 
    // references membership_plans.id, it should be a single object).
    const plan = membership.membership_plans as unknown as { tier: unknown } | null;
    const rawTier = plan?.tier;

    // Validate at runtime, fail-closed to "free"
    const validatedTier = tierSchema.parse(rawTier);

    return { tier: validatedTier };
  },
);
