import { useState } from "react";
import { Check, ChevronDown, LockKeyhole, Save, SlidersHorizontal } from "lucide-react";
import { TopBar } from "@/components/brand/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { membershipInfo, profileFaqs, profilePreferences } from "@/data/profile";

export function SettingsPage() {
  const [preferences, setPreferences] = useState(profilePreferences);
  const [visibility, setVisibility] = useState(profilePreferences.profileVisibility);
  const [saved, setSaved] = useState(false);
  const toggle = (key: "weeklyReview" | "sessionReminders" | "communityUpdates") =>
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Logo compact />
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Settings
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.68fr]">
          <div className="space-y-6">
            <section className="panel p-6 sm:p-8">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Preferences</p>
                  <h1 className="font-display text-3xl font-bold">Shape your signal</h1>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Choose what deserves your attention. These controls are saved locally in this
                    preview.
                  </p>
                </div>
                <SlidersHorizontal className="size-5 text-primary" />
              </div>
              <div className="mt-7 divide-y divide-border">
                {(
                  [
                    ["weeklyReview", "Weekly review", "A reminder to reflect on your commitments."],
                    [
                      "sessionReminders",
                      "Session reminders",
                      "Keep upcoming Wolf Sessions visible.",
                    ],
                    [
                      "communityUpdates",
                      "Community updates",
                      "Hear when The Pack has something worth reading.",
                    ],
                  ] as const
                ).map(([key, label, detail]) => (
                  <div className="flex items-center justify-between gap-4 py-5" key={key}>
                    <div>
                      <p className="font-semibold">{label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                    </div>
                    <button
                      type="button"
                      aria-pressed={preferences[key]}
                      onClick={() => toggle(key)}
                      className={`relative h-6 w-11 rounded-full transition ${preferences[key] ? "bg-primary" : "bg-muted"}`}
                    >
                      <span
                        className={`absolute top-1 size-4 rounded-full bg-background transition ${preferences[key] ? "left-6" : "left-1"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            <section className="panel p-6 sm:p-8">
              <p className="eyebrow">Privacy</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Profile visibility</h2>
              <label className="mt-5 grid gap-2 text-sm font-semibold">
                Who can see your profile
                <select
                  className="field-control"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                >
                  <option value="members">Members of The 1% Club</option>
                  <option value="private">Only me</option>
                </select>
              </label>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <LockKeyhole className="size-3.5" />
                Your personal information stays in this local preview.
              </p>
              <Button className="mt-6" onClick={save}>
                <Save className="mr-2 size-4" />
                Save settings
              </Button>
            </section>
          </div>
          <aside className="space-y-6">
            <section className="panel p-6">
              <p className="eyebrow">Membership</p>
              <h2 className="mt-2 font-display text-2xl font-bold capitalize">
                {membershipInfo.tier} membership
              </h2>
              <p className="mt-1 text-sm text-primary">{membershipInfo.renewalLabel}</p>
              <div className="mt-5 grid gap-3">
                {membershipInfo.benefits.map((benefit) => (
                  <p className="flex items-start gap-2 text-sm text-muted-foreground" key={benefit}>
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {benefit}
                  </p>
                ))}
              </div>
            </section>
            <section className="panel p-6">
              <p className="eyebrow">Support</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Common questions</h2>
              <div className="mt-4 divide-y divide-border">
                {profileFaqs.map((faq) => (
                  <details className="group py-3" key={faq.id}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                      {faq.question}
                      <ChevronDown className="size-4 transition group-open:rotate-180" />
                    </summary>
                    <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </aside>
        </div>
        {saved ? (
          <div className="toast-success">
            <Check className="size-4" />
            Settings saved locally
          </div>
        ) : null}
      </main>
    </div>
  );
}
