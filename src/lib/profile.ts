import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase/server";
import type { MemberProfile } from "../types";

/** Normalises the handle to lowercase, stripping any leading @ */
export function normalizeHandle(handle: string): string {
  return handle.trim().toLowerCase().replace(/^@/, "");
}

/** Generates initials from the display name */
export function deriveInitials(displayName: string | null | undefined): string {
  if (!displayName) return "M";
  const parts = displayName.trim().split(/\s+/);
  const firstPart = parts[0] || "M";
  if (parts.length === 1) return firstPart.substring(0, 2).toUpperCase();
  const lastPart = parts[parts.length - 1] || "M";
  return (firstPart.charAt(0) + lastPart.charAt(0)).toUpperCase();
}

/** Regex for handle validation (only a-z, 0-9, and underscores allowed, max 30 chars) */
const handleRegex = /^[a-z0-9_]{3,30}$/;

const onboardingSchema = z.object({
  display_name: z.string().min(1, "Display name is required."),
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters.")
    .max(30, "Handle must be at most 30 characters.")
    .transform(normalizeHandle)
    .refine((val) => handleRegex.test(val), {
      message: "Handle can only contain lowercase letters, numbers, and underscores.",
    }),
});

/**
 * Returns the profile for the currently authenticated user.
 * Derived initials are calculated here.
 * Entitlement and progress fields are intentionally left undefined (to be implemented).
 */
export const getCurrentProfileFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ profile: MemberProfile | null }> => {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { profile: null };

    const { data: row, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !row) return { profile: null };

    const profile: MemberProfile = {
      id: row.id,
      name: row.display_name ?? "Member",
      handle: row.handle ?? `user_${row.id.substring(0, 6)}`,
      username: row.username ?? undefined,
      initials: deriveInitials(row.display_name),
      bio: row.bio ?? undefined,
      location: row.location ?? undefined,
      avatar_url: row.avatar_url ?? undefined,
      phone: row.phone ?? undefined,
      // joinedLabel: could be derived from row.created_at here if needed
    };

    return { profile };
  },
);

/**
 * Completes onboarding by setting display_name, handle, and onboarding_completed_at.
 * Handles database unique constraint violations for the handle.
 */
export const completeOnboardingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => onboardingSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false as const, error: "Unauthorized. Please sign in." };
    }

    // Use a server-generated ISO timestamp since DDL changes are deferred.
    const nowISO = new Date().toISOString();

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: data.display_name,
        handle: data.handle,
        onboarding_completed_at: nowISO,
      })
      .eq("id", user.id);

    if (error) {
      // 23505 is the PostgreSQL error code for unique_violation
      if (error.code === "23505" && error.message.includes("handle")) {
        return { success: false as const, error: "This handle is already taken." };
      }
      return { success: false as const, error: "Failed to update profile. Please try again." };
    }

    return { success: true as const };
  });

const updateProfileSchema = z.object({
  display_name: z.string().min(1, "Display name is required.").optional(),
  username: z.string().min(1, "Username is required.").max(50).optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

/**
 * Updates the user's profile details.
 */
export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => updateProfileSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false as const, error: "Unauthorized. Please sign in." };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        ...(data.display_name !== undefined && { display_name: data.display_name }),
        ...(data.username !== undefined && { username: data.username }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url }),
      })
      .eq("id", user.id);

    if (error) {
      return { success: false as const, error: "Failed to update profile. Please try again." };
    }

    return { success: true as const };
  });

const uploadAvatarSchema = z.object({
  base64: z.string().min(1),
  contentType: z.string().min(1),
  fileExt: z.string().min(1),
});

export const uploadAvatarFn = createServerFn({ method: 'POST' })
  .validator((data) => uploadAvatarSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    const binaryString = atob(data.base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const fileBuffer = bytes.buffer;
    const fileName = user.id + '-' + Date.now() + '.' + data.fileExt;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, fileBuffer, {
        contentType: data.contentType,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    return { success: true, publicUrl };
  });
