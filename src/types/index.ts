export interface MemberProfile {
  id: string;
  name: string;
  handle: string;
  username?: string;
  initials: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  location?: string;
  joinedLabel?: string;
  role?: string;
  tier?: MembershipTier;
  streak?: number;
  totalMarks?: number;
  completedLessons?: number;
  accountabilityScore?: number;
  custom_status?: string;
  custom_background_url?: string;
  timezone?: string;
  daily_reset_time?: string;
  personal_info?: Record<string, string>;
  power_level?: number;
  power_points?: number;
}
