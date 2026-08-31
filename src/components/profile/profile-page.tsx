import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Check, Edit, Image as ImageIcon, MessageCircleQuestion, Globe, Clock, Crown, Coins } from "lucide-react";
import { TopBar } from "@/components/brand/navigation";
import { Button } from "@/components/ui/button";
import { updateProfileFn, getCurrentProfileFn, uploadAvatarFn, uploadBackgroundFn } from "@/lib/profile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberProfile } from "@/types";
import { Link } from "@tanstack/react-router";

// Utility to calculate next reset time
function getNextReset(timezone: string, timeString: string) {
  try {
    const now = new Date();
    // Default to UTC if Intl fails or timeString is invalid
    const tz = timezone || "UTC";
    const [hours, minutes] = (timeString || "00:00").split(":").map(Number);
    
    // Create a formatter for the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });

    // Parse the current time in the target timezone
    const parts = formatter.formatToParts(now);
    const dateMap = Object.fromEntries(parts.map(p => [p.type, p.value]));
    
    // Construct a Date object representing the time in that timezone
    const tzDate = new Date(
      Number(dateMap.year),
      Number(dateMap.month) - 1,
      Number(dateMap.day),
      Number(dateMap.hour),
      Number(dateMap.minute),
      Number(dateMap.second)
    );

    // Create target time for today
    const targetDate = new Date(tzDate);
    targetDate.setHours(hours, minutes, 0, 0);

    // If target time has passed today, next reset is tomorrow
    if (tzDate.getTime() >= targetDate.getTime()) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    return targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + 
           " at " + 
           targetDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  } catch (e) {
    return "Invalid date/time";
  }
}

const PERSONAL_INFO_FIELDS = [
  { label: "Employment Status", key: "employment", options: ["Employed", "Self-employed", "Unemployed", "Student"] },
  { label: "Traditional education status", key: "education", options: ["High School", "Bachelor's", "Master's", "Ph.D", "None"] },
  { label: "Business Focus", key: "business", options: ["E-commerce", "SaaS", "Agency", "Freelance", "Other"] },
  { label: "Gym Membership", key: "gym", options: ["Yes", "No"] },
  { label: "Exercise Frequency", key: "exercise", options: ["Daily", "3-4 times a week", "1-2 times a week", "Rarely", "Never"] },
];

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["currentProfile"],
    queryFn: () => getCurrentProfileFn(),
  });

  const profile = data?.profile;

  // Form State
  const [customStatus, setCustomStatus] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [dailyResetTime, setDailyResetTime] = useState("00:00");
  const [personalInfo, setPersonalInfo] = useState<Record<string, string>>({});
  
  // Edit Modes
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);

  // Local UI State for Preview
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>("");
  const [localBackgroundUrl, setLocalBackgroundUrl] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);

  // Initialize state when profile loads
  useEffect(() => {
    if (profile) {
      setCustomStatus(profile.custom_status || "");
      setBio(profile.bio || "");
      setTimezone(profile.timezone || "UTC");
      setDailyResetTime(profile.daily_reset_time || "00:00");
      setPersonalInfo(profile.personal_info || {});
      setLocalAvatarUrl(profile.avatar_url || "");
      setLocalBackgroundUrl(profile.custom_background_url || "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateProfileFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentProfile"] });
      alert("Profile saved successfully!");
      setIsEditingSettings(false);
      setIsEditingPersonalInfo(false);
    },
    onError: (error: any) => {
      alert(`Error saving profile: ${error.message}`);
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    await updateMutation.mutateAsync({
      data: {
        custom_status: customStatus,
        bio: bio,
        timezone: timezone,
        daily_reset_time: dailyResetTime,
        personal_info: personalInfo,
      },
    });
    setIsSaving(false);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Please choose an image under 5MB.");
      return;
    }

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(((reader.result as string).split(',')[1] ?? ''));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const fileExt = file.name.split('.').pop() ?? 'jpg';
      const payload = { data: { base64, contentType: file.type, fileExt } };

      if (type === "avatar") {
        const result = await uploadAvatarFn(payload);
        if (result.success) setLocalAvatarUrl(result.publicUrl!);
        else alert(`Avatar upload failed: ${result.error}`);
      } else {
        const result = await uploadBackgroundFn(payload);
        if (result.success) setLocalBackgroundUrl(result.publicUrl!);
        else alert(`Background upload failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Upload error: ${error.message}`);
    } finally {
      e.target.value = '';
    }
  };

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading profile...</div>;
  }

  // Dynamic values derived from the profile
  const powerLevel = profile?.power_level || 1;
  const powerPoints = profile?.power_points || 0;
  const powerProgress = profile?.power_progress || 0;
  const streak = profile?.streak || 0;
  const tier = profile?.tier || "member";
  
  const rankLabel = `${tier.charAt(0).toUpperCase() + tier.slice(1)} in ${streak} days`;
  const roles = profile?.roles || [];

  return (
    <div className="min-h-screen bg-[#080b11] text-white pb-24 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0d121c] px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded bg-[#a78b5a] px-5 py-1.5 text-sm font-bold text-[#0d121c] transition-colors hover:bg-[#bda06b] disabled:opacity-50"
        >
          {isSaving ? "SAVING..." : "SAVE"}
        </button>
      </header>

      <main className="mx-auto max-w-2xl p-4 space-y-8">
        
        {/* Custom Status */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">Custom Status</h2>
          <input
            type="text"
            value={customStatus}
            onChange={(e) => setCustomStatus(e.target.value)}
            className="w-full rounded-md border border-[#c19b6c] bg-[#0d121c] px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#c19b6c]"
            placeholder="What's on your mind?"
          />
          <div className="flex gap-6 text-sm font-semibold text-gray-400">
            <button className="hover:text-white transition-colors">Change</button>
            <button onClick={() => setCustomStatus("")} className="hover:text-white transition-colors">Remove</button>
          </div>
        </section>

        {/* Avatar */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">Avatar</h2>
          <div className="flex flex-col items-center gap-3 w-fit">
            <div 
              onClick={() => avatarInputRef.current?.click()}
              className="relative flex size-28 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#f2b96d] to-[#d69046] hover:opacity-90 transition-opacity"
            >
              {localAvatarUrl ? (
                <img src={localAvatarUrl} alt="Avatar" className="size-full object-cover" />
              ) : profile?.initials ? (
                <span className="text-3xl font-bold text-[#0d121c]">{profile.initials}</span>
              ) : (
                <ImageIcon className="size-8 text-[#0d121c]/50" />
              )}
            </div>
            <button onClick={() => setLocalAvatarUrl("")} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
              Remove
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={avatarInputRef}
              onChange={(e) => handleImageUpload(e, "avatar")}
            />
          </div>
        </section>

        {/* Custom Background */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">Custom Background</h2>
          <div 
            onClick={() => backgroundInputRef.current?.click()}
            className="relative h-32 w-full cursor-pointer overflow-hidden rounded-md border border-[#c19b6c] bg-[#0d121c] hover:opacity-90 transition-opacity"
          >
            {localBackgroundUrl && (
              <img src={localBackgroundUrl} alt="Background" className="size-full object-cover" />
            )}
            {!localBackgroundUrl && (
               <div className="flex h-full items-center justify-center text-gray-500">
                 Tap to upload background
               </div>
            )}
          </div>
          <button onClick={() => setLocalBackgroundUrl("")} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            Remove
          </button>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={backgroundInputRef}
            onChange={(e) => handleImageUpload(e, "background")}
          />
        </section>

        {/* BIO */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">BIO (Max 200 characters)</h2>
          <textarea
            maxLength={200}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="h-32 w-full resize-none rounded-md border border-[#c19b6c] bg-[#0d121c] p-4 text-white focus:outline-none focus:ring-1 focus:ring-[#c19b6c]"
            placeholder="Tell us about yourself..."
          />
          <button 
            onClick={handleSave}
            className="rounded bg-[#332a1e] px-6 py-2 text-sm font-semibold text-[#c19b6c] hover:bg-[#4a3d2c] transition-colors"
          >
            Save
          </button>
        </section>

        <hr className="border-[#c19b6c]/30 border-t-2" />

        {/* Checklist Reset Settings */}
        <section className="rounded-xl border border-white/10 bg-[#111827] p-5 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-widest text-gray-300">CHECKLIST RESET SETTINGS</h2>
            {!isEditingSettings ? (
              <button 
                onClick={() => setIsEditingSettings(true)}
                className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Edit className="size-4" /> Edit
              </button>
            ) : (
               <button 
                onClick={handleSave}
                className="flex items-center gap-2 rounded border border-[#f2b96d] bg-[#332a1e] px-3 py-1.5 text-sm font-bold text-[#f2b96d] hover:bg-[#4a3d2c] transition-colors"
              >
                Save
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Globe className="size-5" />
                <span>Timezone</span>
              </div>
              {!isEditingSettings ? (
                 <span className="font-bold">{timezone}</span>
              ) : (
                <select 
                  value={timezone} 
                  onChange={(e) => setTimezone(e.target.value)}
                  className="rounded-md border border-white/20 bg-[#1f2937] px-3 py-1 text-white focus:outline-none focus:ring-1 focus:ring-[#f2b96d]"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Central Europe (CET)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                  <option value="Africa/Lagos">Lagos (WAT)</option>
                </select>
              )}
            </div>
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="size-5" />
                <span>Daily Reset Time</span>
              </div>
              {!isEditingSettings ? (
                <span className="font-bold">{dailyResetTime}</span>
              ) : (
                <input 
                  type="time" 
                  value={dailyResetTime}
                  onChange={(e) => setDailyResetTime(e.target.value)}
                  className="rounded-md border border-white/20 bg-[#1f2937] px-3 py-1 text-white focus:outline-none focus:ring-1 focus:ring-[#f2b96d]"
                />
              )}
            </div>
            
            <div className="pt-2 text-sm text-gray-400">
              Next reset: {getNextReset(timezone, dailyResetTime)}
            </div>
          </div>
        </section>

        <hr className="border-[#c19b6c]/30 border-t-2" />

        {/* Personal Information */}
        <section className="rounded-xl border border-white/10 bg-[#111827] p-5 shadow-lg relative">
          <div className="mb-6 flex items-start justify-between">
            <h2 className="text-sm font-bold tracking-widest text-gray-300 w-32 leading-relaxed">PERSONAL INFORMATION</h2>
            {!isEditingPersonalInfo ? (
               <button 
                  onClick={() => setIsEditingPersonalInfo(true)}
                  className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <Edit className="size-4" /> Edit
                </button>
            ) : (
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded border border-[#f2b96d] bg-[#332a1e] px-4 py-1.5 text-sm font-bold text-[#f2b96d] hover:bg-[#4a3d2c] transition-colors"
                >
                  Save
                </button>
            )}
          </div>

          <div className="space-y-5">
            {PERSONAL_INFO_FIELDS.map((field) => (
              <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2 sm:gap-0">
                <span className="text-gray-300">{field.label}</span>
                {!isEditingPersonalInfo ? (
                   <span className="font-semibold text-gray-400">{personalInfo[field.key] || "Not answered"}</span>
                ) : (
                   <select
                     value={personalInfo[field.key] || ""}
                     onChange={(e) => setPersonalInfo({ ...personalInfo, [field.key]: e.target.value })}
                     className="rounded-md border border-white/20 bg-[#1f2937] px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-[#f2b96d]"
                   >
                     <option value="" disabled>Select an option</option>
                     {field.options.map(opt => (
                       <option key={opt} value={opt}>{opt}</option>
                     ))}
                   </select>
                )}
              </div>
            ))}
          </div>
          
          <button className="absolute -bottom-4 -right-2 flex size-12 items-center justify-center rounded-full bg-[#f2b96d] text-black shadow-lg hover:bg-[#d69046] transition-colors">
            <MessageCircleQuestion className="size-6" />
          </button>
        </section>

        <hr className="border-[#c19b6c]/30 border-t-2" />

        {/* Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold">Preview</h2>
             <button className="flex size-10 items-center justify-center rounded-full bg-[#f2b96d] text-black shadow-lg hover:bg-[#d69046] transition-colors">
              <MessageCircleQuestion className="size-5" />
            </button>
          </div>
         
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-xl">
            {/* Banner */}
            <div className="h-32 w-full bg-purple-900 relative">
               {localBackgroundUrl && (
                  <img src={localBackgroundUrl} alt="Banner" className="size-full object-cover" />
               )}
            </div>
            
            {/* Profile Info Overlay */}
            <div className="relative px-5 pb-5 pt-3">
              <div className="absolute -top-12 left-5 flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#111827] bg-[#f2b96d]">
                 {localAvatarUrl ? (
                    <img src={localAvatarUrl} alt="Avatar" className="size-full object-cover" />
                  ) : profile?.initials ? (
                    <span className="text-2xl font-bold text-black">{profile.initials}</span>
                  ) : null}
              </div>
              
              <div className="ml-28 flex items-center justify-between">
                <h3 className="text-xl font-bold">{profile?.username || profile?.name || "wolf billion"}</h3>
              </div>

              <div className="mt-6 flex items-center justify-between border-b-2 border-[#f2b96d] pb-2">
                 <div className="flex items-center gap-2 text-gray-300">
                    <Crown className="size-4 text-[#f2b96d]" />
                    <span className="font-semibold">{rankLabel}</span>
                 </div>
                 <div className="flex items-center gap-1 rounded bg-[#332a1e] px-2 py-1 text-[#f2b96d] font-bold">
                    <Coins className="size-4 text-[#f2b96d]" />
                    <span>{powerPoints.toLocaleString()}</span>
                 </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-2">
              <button className="border-b-2 border-[#f2b96d] px-6 py-3 font-semibold text-white">Info</button>
              <button className="px-6 py-3 font-semibold text-gray-500 hover:text-gray-300">Journey</button>
              <button className="px-6 py-3 font-semibold text-gray-500 hover:text-gray-300">Stats</button>
            </div>

            {/* Tab Content */}
            <div className="p-5 space-y-6">
               <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-300">Power Level: <span className="text-white">{powerLevel}</span></span>
                  <span className="text-gray-400">+{powerProgress}% <Crown className="size-3 inline-block" /></span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-300">Power Points: <span className="text-[#f2b96d]">{powerPoints.toLocaleString()}</span></span>
               </div>
               
               <div className="space-y-3">
                  <h4 className="font-bold text-gray-300">Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {roles.length > 0 ? roles.map((role, idx) => (
                      <span key={idx} className="flex items-center gap-2 rounded-full bg-[#1f2937] px-4 py-1.5 text-sm font-semibold">
                         <span className="size-2 rounded-full bg-white"></span>
                         {role}
                      </span>
                    )) : (
                      <span className="text-gray-500 italic text-sm">No roles assigned</span>
                    )}
                  </div>
               </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
