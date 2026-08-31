import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase/server";
import type { MemberProfile } from "../types";

export function normalizeHandle(handle: string): string {
  return handle.trim().toLowerCase().replace(/^@/, "");
}

export function deriveInitials(displayName: string | null | undefined): string {
  if (!displayName) return "M";
  const parts = displayName.trim().split(/\s+/);
  const firstPart = parts[0] || "M";
  if (parts.length === 1) return firstPart.substring(0, 2).toUpperCase();
  const lastPart = parts[parts.length - 1] || "M";
  return (firstPart.charAt(0) + lastPart.charAt(0)).toUpperCase();
}

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
      custom_status: row.custom_status ?? undefined,
      custom_background_url: row.custom_background_url ?? undefined,
      timezone: row.timezone ?? undefined,
      daily_reset_time: row.daily_reset_time ?? undefined,
      personal_info: row.personal_info ?? undefined,
      power_level: row.power_level ?? 1,
      power_points: row.power_points ?? 0,
      power_progress: row.power_progress ?? 0,
      roles: row.roles ?? [],
      streak: row.streak ?? 0,
    };

    return { profile };
  },
);

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
  bio: z.string().max(200, "Bio max 200 characters.").optional(),
  custom_status: z.string().optional().or(z.literal("")),
  timezone: z.string().optional(),
  daily_reset_time: z.string().optional(),
  personal_info: z.record(z.string(), z.string()).optional(),
  custom_background_url: z.string().url().optional().or(z.literal("")),
});

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
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.custom_status !== undefined && { custom_status: data.custom_status }),
        ...(data.timezone !== undefined && { timezone: data.timezone }),
        ...(data.daily_reset_time !== undefined && { daily_reset_time: data.daily_reset_time }),
        ...(data.personal_info !== undefined && { personal_info: data.personal_info }),
        ...(data.custom_background_url !== undefined && { custom_background_url: data.custom_background_url }),
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

export const uploadBackgroundFn = createServerFn({ method: 'POST' })
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
      .from('backgrounds')
      .upload(fileName, fileBuffer, {
        contentType: data.contentType,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('backgrounds')
      .getPublicUrl(fileName);

    await supabase
      .from('profiles')
      .update({ custom_background_url: publicUrl })
      .eq('id', user.id);

    return { success: true, publicUrl };
  });
