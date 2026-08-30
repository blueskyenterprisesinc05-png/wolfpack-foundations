import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";

// Inline Toggle Component
function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        checked ? "bg-[#34d399]" : "bg-secondary"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function SettingsNotificationsPage() {
  const [extraSounds, setExtraSounds] = useState(true);
  const [inAppSounds, setInAppSounds] = useState(true);
  const [afkPush, setAfkPush] = useState(false);
  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'campus'

  return (
    <div className="min-h-screen bg-obsidian relative pb-24">
      <main className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-4 bg-obsidian border-b border-border/50 sticky top-0 z-10">
          <Link to="/settings" className="p-2 -ml-2 rounded-full text-foreground hover:bg-secondary/50 hover:text-gold transition-colors">
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        </div>

        <div className="p-4 sm:p-6 space-y-8">
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>

          {/* Device Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Device</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-medium text-foreground">Push Notifications</span>
                <span className="text-[15px] font-bold text-[#34d399]">ENABLED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-medium text-foreground">Extra Sound Effects</span>
                <Toggle checked={extraSounds} onChange={setExtraSounds} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-medium text-foreground">In-App Notification Sound</span>
                <Toggle checked={inAppSounds} onChange={setInAppSounds} />
              </div>
            </div>
          </section>

          {/* Advanced Settings Section */}
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-foreground">Advanced Settings</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-medium text-foreground">AFK Push</span>
                <Toggle checked={afkPush} onChange={setAfkPush} />
              </div>
              <p className="text-[15px] text-muted-foreground/90 leading-relaxed pr-6">
                If you get a message while your app is open, we'll send you a push anyway if you don't read it after a few minutes.
              </p>
            </div>
          </section>

          {/* Tabs Section */}
          <section className="pt-4 space-y-6">
            <div className="flex border-b border-border/40">
              <button 
                onClick={() => setActiveTab('global')}
                className={`flex-1 py-3 text-[15px] font-medium transition-colors border-b-2 ${activeTab === 'global' ? 'border-gold text-gold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Global Settings
              </button>
              <button 
                onClick={() => setActiveTab('campus')}
                className={`flex-1 py-3 text-[15px] font-medium transition-colors border-b-2 ${activeTab === 'campus' ? 'border-gold text-gold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Campus-Specific
              </button>
            </div>

            {/* Reactions Block */}
            <div className="bg-charcoal/50 rounded-xl p-5 border border-border/30 hover:border-border transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 pr-12">
                  <h3 className="text-[17px] font-bold text-foreground">Reactions</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    Get notified when others react to your messages
                  </p>
                </div>
              </div>
            </div>
          </section>

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
