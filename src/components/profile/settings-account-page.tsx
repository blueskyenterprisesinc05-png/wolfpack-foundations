import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { updateProfileFn } from "@/lib/profile";
import { getBrowserClient } from "@/lib/supabase/browser";
import {
  Crown,
  ChevronRight,
  MessageCircleQuestion,
  ArrowLeft,
  Pencil,
  AtSign,
  Mail,
  Phone,
  Key,
  List,
  Lock,
  Check,
  X
} from "lucide-react";

// Inline Editable Field Component
function EditableField({ 
  icon: Icon, 
  label, 
  value, 
  type = "text",
  onSave,
  extraLabel
}: {
  icon: any, label: string, value: string, type?: string, onSave: (val: string) => void, extraLabel?: React.ReactNode
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-4 group hover:bg-secondary/30 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Icon className="size-6 text-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
        <div className="flex flex-col flex-1 mr-4">
          <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase flex items-center gap-2">
            {label}
            {extraLabel}
          </span>
          {isEditing ? (
            <input 
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="mt-1 bg-charcoal border border-gold rounded-md px-3 py-1.5 text-[15px] text-foreground focus:outline-none focus:ring-1 focus:ring-gold w-full"
              autoFocus
            />
          ) : (
            <span className={`text-[15px] ${value === 'Not Set' ? 'text-muted-foreground italic' : 'text-foreground'} ${type === 'password' ? 'tracking-[0.2em] font-bold mt-1' : ''}`}>
              {type === 'password' ? '.........' : value}
            </span>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={handleSave} className="p-2 text-forest hover:bg-forest/10 rounded-full transition-colors">
            <Check className="size-5" />
          </button>
          <button onClick={handleCancel} className="p-2 text-crimson hover:bg-crimson/10 rounded-full transition-colors">
            <X className="size-5" />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-foreground/50 hover:text-gold hover:bg-secondary rounded-full transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-gold outline-none shrink-0"
        >
          <Pencil className="size-4.5" />
        </button>
      )}
    </div>
  );
}

export function SettingsAccountPage({ user, profile }: { user: any; profile: any }) {
  const [userData, setUserData] = useState({
    username: profile?.username || "",
    email: user?.email || "Not Set",
    phone: profile?.phone || user?.phone || "Not Set",
  });

  const userId = user?.id || "01KP9W3CBMFGCJ5XYQQF2FSTV1";
  const emailVerified = user?.email_confirmed_at || user?.user_metadata?.email_verified ? true : false;
  
  const [localAvatarUrl, setLocalAvatarUrl] = useState(
    profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + userData.username
  );
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdate = async (field: string, val: string) => {
    setUserData(prev => ({ ...prev, [field]: val }));
    
    if (field === 'username') {
      await updateProfileFn({ data: { username: val } });
    } else if (field === 'phone') {
      await updateProfileFn({ data: { phone: val } });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = getBrowserClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await updateProfileFn({ data: { avatar_url: publicUrl } });
      setLocalAvatarUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian relative pb-24">
      <main className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-4 bg-obsidian border-b border-border/50 sticky top-0 z-10">
          <Link to="/settings" className="p-2 -ml-2 rounded-full text-foreground hover:bg-secondary/50 hover:text-gold transition-colors">
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">My Account</h1>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* JOIN THE COUNCIL Block */}
          <div className="border border-gold rounded-xl overflow-hidden bg-charcoal/30 transition-colors hover:bg-charcoal/50 group">
            <div className="p-4 flex items-center justify-between border-b border-border/20 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="size-8 overflow-hidden rounded-md bg-white/10 flex items-center justify-center">
                  <img src="https://api.dicebear.com/7.x/shapes/svg?seed=council" alt="Council" className="size-6 opacity-80" />
                </div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-gold transition-colors">JOIN THE COUNCIL</h2>
              </div>
              <ChevronRight className="size-6 text-foreground group-hover:text-gold transition-colors" />
            </div>
            <div className="p-4 space-y-2">
              {[
                "Add friends within THE COUNCIL",
                "Communicate with the best of THE REAL WORLD.",
                "Experience the inner workings of a world-class team.",
                "Join your Professors in changing lives for the better."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg className="size-5 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-foreground/90">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div 
                className="relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="size-16 rounded-full bg-gradient-to-tr from-secondary to-accent border-2 border-border overflow-hidden relative">
                  <img
                    src={localAvatarUrl}
                    alt="Avatar"
                    className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-80 group-hover:opacity-100'}`}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-charcoal rounded-full p-1 border border-border">
                  <Pencil className="size-3 text-gold" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">@{userData.username}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="size-3 rounded-full border border-muted-foreground flex items-center justify-center text-[8px]">i</span>
                  {userId.substring(0, 26)}
                </span>
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 px-1">Account Information</h3>
            <div className="border border-gold rounded-xl overflow-hidden bg-charcoal/30 flex flex-col divide-y divide-gold/20">
              
              <EditableField 
                icon={AtSign} 
                label="Username" 
                value={userData.username} 
                onSave={(v) => handleUpdate('username', v)} 
              />

              <EditableField 
                icon={Mail} 
                label="Email Address" 
                value={userData.email} 
                onSave={(v) => handleUpdate('email', v)} 
                extraLabel={
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${emailVerified ? 'bg-forest/20 text-forest' : 'bg-crimson/20 text-crimson'}`}>
                    {emailVerified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                }
              />

              <EditableField 
                icon={Phone} 
                label="Phone Number" 
                value={userData.phone} 
                onSave={(v) => handleUpdate('phone', v)} 
              />

              <EditableField 
                icon={Key} 
                label="Password" 
                value="password123" // dummy value for password field behavior
                type="password"
                onSave={(v) => console.log('Update password')} 
              />

            </div>
          </div>

          {/* Two-factor Authentication Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1 px-1">Two-factor Authentication</h3>
            <p className="text-sm text-foreground/80 mb-4 px-1">Add an extra layer of security by enabling 2FA on your account.</p>
            
            <div className="border border-gold rounded-xl overflow-hidden bg-charcoal/30 flex flex-col divide-y divide-border/50">
              
              {/* Backup Codes */}
              <button className="w-full text-left flex items-center gap-4 p-4 group hover:bg-secondary/30 transition-colors focus:bg-secondary/30 outline-none">
                <List className="size-6 text-muted-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-muted-foreground tracking-wide uppercase group-hover:text-foreground transition-colors">Generate Backup Codes</span>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Get ready to use 2FA by setting a backup method.</span>
                </div>
              </button>

              {/* Add Authenticator */}
              <button className="w-full text-left flex items-center gap-4 p-4 group hover:bg-secondary/30 transition-colors focus:bg-secondary/30 outline-none">
                <Lock className="size-6 text-muted-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-muted-foreground tracking-wide uppercase group-hover:text-foreground transition-colors">Add Authenticator</span>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Set up time-based one-time password (TOTP).</span>
                </div>
              </button>

            </div>
          </div>

          {/* Customize Profile Link */}
          <div className="bg-charcoal/50 rounded-xl p-4 flex items-center justify-between border border-border/30 hover:border-gold/50 transition-colors group">
            <span className="text-foreground text-[15px] font-medium">Looking to customize your profile?</span>
            <Link to="/profile" className="text-gold group-hover:text-gold-tint transition-colors text-sm font-medium py-1 px-2 rounded-md hover:bg-gold/10">
              Head to your profile settings.
            </Link>
          </div>

        </div>
      </main>

      {/* Floating Action Button (Support) */}
      <button
        className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 size-14 rounded-full bg-gold flex items-center justify-center shadow-lg hover:bg-gold-tint hover:scale-105 active:scale-95 transition-all z-50 focus:ring-4 focus:ring-gold/30 outline-none"
        aria-label="Support Chat"
      >
        <MessageCircleQuestion className="size-6 text-black fill-black" />
      </button>
    </div>
  );
}
