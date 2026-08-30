import { communityMembers } from "@/data/community";

export function MemberSidebar() {
  const moderators = communityMembers.filter((m) => m.role === "Moderator");
  const members = communityMembers.filter((m) => m.role === "Member");

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4 bg-charcoal">
        <h2 className="font-semibold text-foreground">Members</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-4 bg-charcoal">
        <div className="mb-6 px-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Moderators — {moderators.length}
          </h3>
          <div className="flex flex-col gap-3">
            {moderators.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-crimson/20 text-xs font-bold text-crimson">
                  {m.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{m.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Members — {members.length}
          </h3>
          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                  {m.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{m.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
