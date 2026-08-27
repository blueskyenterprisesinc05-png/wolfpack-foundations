import { useState } from "react";
import { Check, Edit3, MapPin, ShieldCheck, Trophy } from "lucide-react";
import { TopBar } from "@/components/brand/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { memberProfile, profileActivity, profileMarks } from "@/data/profile";

export function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(memberProfile.name);
  const [bio, setBio] = useState(memberProfile.bio);
  const [saved, setSaved] = useState(false);
  const save = () => {
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Logo compact />
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Member profile
          </span>
        </div>
        <section className="grid gap-6 lg:grid-cols-[1fr_0.68fr]">
          <div className="space-y-6">
            <div className="panel p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-xl font-bold text-primary">
                    {memberProfile.initials}
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                      {memberProfile.role}
                    </p>
                    <h1 className="font-display text-3xl font-bold text-foreground">{name}</h1>
                    <p className="text-sm text-muted-foreground">{memberProfile.handle}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  <Edit3 className="mr-2 size-4" />
                  Edit profile
                </Button>
              </div>
              {editing ? (
                <div className="mt-6 grid gap-4 border-t border-border pt-6">
                  <label className="grid gap-2 text-sm font-semibold">
                    Name
                    <input
                      className="field-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    Bio
                    <textarea
                      className="field-control min-h-24"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </label>
                  <div className="flex gap-2">
                    <Button onClick={save}>
                      <Check className="mr-2 size-4" />
                      Save changes
                    </Button>
                    <Button variant="ghost" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {bio}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      {memberProfile.location}
                    </span>
                    <span>{memberProfile.joinedLabel}</span>
                  </div>
                </>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [memberProfile.streak, "Day streak"],
                [memberProfile.totalMarks, "Marks earned"],
                [memberProfile.accountabilityScore + "%", "Accountability"],
              ].map(([value, label]) => (
                <div className="panel p-5" key={label}>
                  <p className="font-display text-3xl font-bold text-primary">{value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            <div className="panel p-6">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Activity</p>
                  <h2 className="font-display text-xl font-bold">Your recent movement</h2>
                </div>
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <div className="mt-5 divide-y divide-border">
                {profileActivity.map((item) => (
                  <div className="flex items-center justify-between gap-4 py-4" key={item.id}>
                    <div>
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.dateLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="panel p-6">
              <p className="eyebrow">Marks</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Proof of practice</h2>
              <div className="mt-5 grid gap-3">
                {profileMarks.map((mark) => (
                  <div
                    className="rounded-lg border border-border bg-secondary/35 p-4"
                    key={mark.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Trophy className="size-5 text-primary" />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {mark.category}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display font-bold">{mark.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {mark.description}
                    </p>
                    <p className="mt-3 text-xs text-primary">{mark.earnedLabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
        {saved ? (
          <div className="toast-success">
            <Check className="size-4" />
            Profile saved locally
          </div>
        ) : null}
      </main>
    </div>
  );
}
