import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Check, Edit, Image as ImageIcon, MessageCircleQuestion } from "lucide-react";
import { TopBar } from "@/components/brand/navigation";
import { Button } from "@/components/ui/button";
import { updateProfileFn, getCurrentProfileFn, uploadAvatarFn, uploadBackgroundFn } from "@/lib/profile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberProfile } from "@/types";
import { Link } from "@tanstack/react-router";

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
            <button className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors">
              <Edit className="size-4" /> Edit
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-lg">🌐</span>
                <span>Timezone</span>
              </div>
              <span className="font-bold">{timezone}</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-lg">🕒</span>
                <span>Daily Reset Time</span>
              </div>
              <span className="font-bold">{dailyResetTime}</span>
            </div>
            
            <div className="pt-2 text-sm text-gray-400">
              Next reset: Aug 31, 2026 at 12:00 AM
            </div>
          </div>
        </section>

        <hr className="border-[#c19b6c]/30 border-t-2" />

        {/* Personal Information */}
        <section className="rounded-xl border border-white/10 bg-[#111827] p-5 shadow-lg relative">
          <div className="mb-6 flex items-start justify-between">
            <h2 className="text-sm font-bold tracking-widest text-gray-300 w-32 leading-relaxed">PERSONAL INFORMATION</h2>
            <button className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors">
              <Edit className="size-4" /> Create
            </button>
          </div>

          <div className="space-y-5">
            {[
              { label: "Employment Status", key: "employment" },
              { label: "Traditional education status", key: "education" },
              { label: "Business Focus", key: "business" },
              { label: "Gym Membership", key: "gym" },
              { label: "Exercise Frequency", key: "exercise" },
            ].map((field) => (
              <div key={field.key} className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-gray-300">{field.label}</span>
                <span className="font-semibold text-gray-400">{personalInfo[field.key] || "Not answered"}</span>
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
                    <span>♔</span>
                    <span className="font-semibold">Silver King in 13 days</span>
                 </div>
                 <div className="flex items-center gap-1 rounded bg-[#332a1e] px-2 py-1 text-[#f2b96d] font-bold">
                    <span className="text-xs">🪙</span>
                    <span>{profile?.power_points || 462}</span>
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
                  <span className="font-bold text-gray-300">Power Level: <span className="text-white">{profile?.power_level || 4}</span></span>
                  <span className="text-gray-400">+17% ♔</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-300">Power Points: <span className="text-[#f2b96d]">{profile?.power_points || "1,449"}</span></span>
               </div>
               
               <div className="space-y-3">
                  <h4 className="font-bold text-gray-300">Roles</h4>
                  <div className="flex flex-wrap gap-2">
                     <span className="flex items-center gap-2 rounded-full bg-[#1f2937] px-4 py-1.5 text-sm font-semibold">
                        <span className="size-2 rounded-full bg-white"></span>
                        Advanced Builders
                     </span>
                     <span className="flex items-center gap-2 rounded-full bg-[#1f2937] px-4 py-1.5 text-sm font-semibold">
                        <span className="size-2 rounded-full bg-white"></span>
                        AI Sellers
                     </span>
                  </div>
               </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
