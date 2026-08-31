import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trophy, Plus, CheckSquare, Trash2, Calendar as CalendarIcon,
  Coins, Building2, ArrowUp, Share2, FileUp, Clock, Pin, X
} from "lucide-react";
import html2canvas from "html2canvas";
import { Target, Flame, Zap } from "lucide-react";
import { getChecklistFn, toggleTaskFn, deleteTaskFn, createGroupFn, createTaskFn } from "@/lib/checklist";
import { getCurrentProfileFn } from "@/lib/profile";

// ─── Quick Add Modal ────────────────────────────────────────────────────────
function QuickAddModal({
  groupName,
  onAdd,
  onCancel,
  isPending,
}: {
  groupName: string;
  onAdd: (title: string) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-[#0f141e] border border-[#1f2937] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-lg font-bold text-white">New Task</h2>
        <label className="mb-2 block text-sm font-bold text-gray-300">Task Title</label>
        <input
          autoFocus
          type="text"
          placeholder="Enter task description"
          className="w-full rounded-lg border border-[#374151] bg-[#141923] px-4 py-3 text-sm font-medium text-white placeholder-gray-500 outline-none focus:border-gold/60 transition-colors"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && title.trim()) onAdd(title.trim());
            if (e.key === "Escape") onCancel();
          }}
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#1f2937] hover:bg-[#374151] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => title.trim() && onAdd(title.trim())}
            disabled={!title.trim() || isPending}
            className="px-6 py-3 rounded-lg text-sm font-bold bg-gold text-[#080b11] hover:bg-[#d4a843] transition-colors disabled:opacity-50"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle Switch ──────────────────────────────────────────────────────────
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={"relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors " + (enabled ? "bg-gold" : "bg-[#374151]")}
    >
      <span className={"inline-block size-5 rounded-full bg-white shadow transition-transform " + (enabled ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}

// ─── Detailed New Task Modal ─────────────────────────────────────────────────
function DetailedTaskModal({
  groupId,
  onAdd,
  onClose,
  isPending,
  timezone,
}: {
  groupId?: string;
  onAdd: (data: Record<string, unknown>) => void;
  onClose: () => void;
  isPending: boolean;
  timezone?: string;
}) {
  const todayInput = new Date().toISOString().slice(0, 10);
  const tzShort = (timezone || "UTC").split("/").pop() || "UTC";

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState(todayInput);
  const [scheduledTime, setScheduledTime] = useState("10:00");
  const [durationMinutes, setDurationMinutes] = useState(360);
  const [customEndTime, setCustomEndTime] = useState(false);
  const [customEndDate, setCustomEndDate] = useState(todayInput);
  const [customEndTimeVal, setCustomEndTimeVal] = useState("12:00");
  const [reminder, setReminder] = useState(false);
  const [reminderValue, setReminderValue] = useState("No reminder");
  const [repeat, setRepeat] = useState(false);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);

  const durationLabel = () => {
    const h = Math.floor(durationMinutes / 60);
    const m = durationMinutes % 60;
    if (h === 0) return m + "m";
    if (m === 0) return h + "h";
    return h + "h " + m + "m";
  };

  const toggleDay = (day: string) => {
    setRepeatDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const days = [
    { key: "pin", label: "📌" },
    { key: "Su", label: "Su" },
    { key: "Mo", label: "Mo" },
    { key: "Tu", label: "Tu" },
    { key: "We", label: "We" },
    { key: "Th", label: "Th" },
    { key: "Fr", label: "Fr" },
    { key: "Sa", label: "Sa" },
  ];

  const handleSubmit = () => {
    if (!taskName.trim()) return;
    onAdd({
      group_id: groupId,
      title: taskName.trim(),
      description,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      duration_minutes: durationMinutes,
      custom_end_date: customEndTime ? customEndDate : undefined,
      custom_end_time: customEndTime ? customEndTimeVal : undefined,
      reminder: reminder ? reminderValue : undefined,
      repeat_days: repeat ? repeatDays : [],
    });
  };

  const pct = (durationMinutes / 720) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080b11]">
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h2 className="text-xl font-bold text-white">New Task</h2>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-full bg-[#1f2937] text-gray-400 hover:text-white transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-5 px-5">
          <input
            autoFocus
            type="text"
            placeholder="Task Name"
            className="w-full rounded-xl border border-[#374151] bg-[#0f141e] px-4 py-4 text-base font-bold text-white placeholder-gray-600 outline-none focus:border-gold/50 transition-colors"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />

          <textarea
            placeholder="Describe your task..."
            rows={3}
            className="w-full rounded-xl border border-[#374151] bg-[#0f141e] px-4 py-3.5 text-sm font-medium text-white placeholder-gray-600 outline-none focus:border-gold/50 resize-none transition-colors"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Schedule */}
          <div>
            <div className="mb-2 flex items-center text-sm font-bold text-white">
              <span className="mr-2">📅</span>
              <span>Show on Daily Schedule</span>
              <span className="ml-auto text-xs font-semibold text-gray-500">Time &nbsp; Local - {tzShort}</span>
            </div>
            <div className="flex gap-3">
              <input type="date" className="flex-1 rounded-lg border border-[#374151] bg-[#0f141e] px-3 py-3 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors [color-scheme:dark]" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
              <input type="time" className="w-28 rounded-lg border border-[#374151] bg-[#0f141e] px-3 py-3 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors [color-scheme:dark]" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
            </div>
          </div>

          {/* Duration */}
          <div>
            <div className="mb-3 text-sm font-bold text-white">Duration {durationLabel()}</div>
            <input
              type="range" min={0} max={720} step={15} value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: "linear-gradient(to right, #e2b96e " + pct + "%, #1f2937 " + pct + "%)" }}
            />
          </div>

          {/* Custom End Time */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Custom End Time</span>
              <Toggle enabled={customEndTime} onChange={setCustomEndTime} />
            </div>
            {customEndTime && (
              <div className="mt-3">
                <div className="mb-2 flex justify-end text-xs font-semibold text-gray-500">Time &nbsp; Local - {tzShort}</div>
                <div className="flex gap-3">
                  <input type="date" className="flex-1 rounded-lg border border-[#374151] bg-[#0f141e] px-3 py-3 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors [color-scheme:dark]" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
                  <input type="time" className="w-28 rounded-lg border border-[#374151] bg-[#0f141e] px-3 py-3 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors [color-scheme:dark]" value={customEndTimeVal} onChange={(e) => setCustomEndTimeVal(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Set Reminder */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Set Reminder</span>
              <Toggle enabled={reminder} onChange={setReminder} />
            </div>
            {reminder && (
              <select className="mt-3 w-full rounded-lg border border-[#374151] bg-[#0f141e] px-4 py-3 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors appearance-none" value={reminderValue} onChange={(e) => setReminderValue(e.target.value)}>
                <option value="No reminder">No reminder</option>
                <option value="At time of task">At time of task</option>
                <option value="5 minutes before">5 minutes before</option>
                <option value="30 minutes before">30 minutes before</option>
                <option value="1 hour before">1 hour before</option>
                <option value="2 hours before">2 hours before</option>
                <option value="1 day before">1 day before</option>
                <option value="2 days before">2 days before</option>
                <option value="1 week before">1 week before</option>
              </select>
            )}
          </div>

          {/* Repeat */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Repeat</span>
              <Toggle enabled={repeat} onChange={setRepeat} />
            </div>
            {repeat && (
              <div className="mt-3">
                <p className="mb-3 text-xs font-semibold text-gray-500">Repeat on</p>
                <div className="flex flex-wrap gap-2">
                  {days.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => toggleDay(key)}
                      className={"flex size-11 items-center justify-center rounded-full text-sm font-bold transition-colors " + (repeatDays.includes(key) ? "bg-gold text-[#080b11]" : "bg-[#1f2937] text-gray-300 hover:bg-[#374151]")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs font-medium text-gray-500">
                  💡 Repeated tasks always reset daily at midnight in your timezone
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#1f2937] bg-[#080b11] px-5 py-4">
        <button
          onClick={handleSubmit}
          disabled={!taskName.trim() || isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-4 text-base font-bold text-[#080b11] hover:bg-[#d4a843] transition-colors disabled:opacity-50"
        >
          <Plus className="size-5" strokeWidth={3} />
          Add Task
        </button>
      </div>
    </div>
  );
}


// ─── Mission Report Modal ───────────────────────────────────────────────────
function MissionReportModal({
  onClose,
  profile,
  checklist,
}: {
  onClose: () => void;
  profile: any;
  checklist: any[];
}) {
  const [isSharing, setIsSharing] = useState(false);

  // Compute real stats
  const totalTasks = checklist.reduce((sum, group) => sum + group.tasks.length, 0);
  const completedTasks = checklist.reduce((sum, group) => sum + group.tasks.filter((t: any) => t.completed).length, 0);
  const disciplinePercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const streak = profile?.streak || 0;
  const powerLevel = profile?.power_level || 0;
  const displayName = profile?.name || profile?.display_name || "WOLF BILLION";
  const initials = profile?.initials || "W";

  // Get up to 3 most recently completed tasks, or just top 3 tasks if none completed
  const allTasks = checklist.flatMap(g => g.tasks);
  const completedTasksList = allTasks.filter(t => t.completed);
  const displayTasks = completedTasksList.length >= 3 
    ? completedTasksList.slice(0, 3) 
    : allTasks.slice(0, 3);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const cardEl = document.getElementById("wolf-billion-card");
      if (!cardEl) return;
      
      // Briefly show it off-screen to render correctly
      cardEl.style.display = "block";
      
      const canvas = await html2canvas(cardEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#080a0f"
      });
      
      cardEl.style.display = "none";

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;

      const file = new File([blob], "mission-report.png", { type: "image/png" });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Wolf Billion Mission Report",
          text: "Check out my daily progress!",
          files: [file]
        });
      } else {
        // Fallback download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mission-report.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <div 
          className="relative z-10 w-full max-w-md h-[90vh] flex flex-col rounded-t-2xl bg-[#0f141e] border-t border-[#1e2530] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-4 p-5 border-b border-[#1e2530]">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#1e1a0e]">
              <Share2 className="size-5 text-gold" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Mission Report</h2>
              <p className="text-sm font-medium text-gray-400">Ready for broadcast. Share your daily performance snapshot.</p>
            </div>
            <button onClick={onClose} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1c2335] text-white hover:bg-[#252d3d] transition-colors">
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24">
            {/* Share Preview Card */}
            <div className="rounded-2xl border border-[#1e2530] bg-[#141b26] p-5">
              <div className="text-xs font-bold tracking-widest text-gray-500 mb-4 uppercase">Share Preview</div>
              <div className="flex items-center gap-5">
                <div className="w-24 h-36 rounded-lg bg-[#080a0f] border border-[#1e2530] flex flex-col items-center justify-center p-2 relative overflow-hidden">
                  {/* Fake thumbnail reflecting real data */}
                  <div className="size-5 rounded-full bg-gold flex items-center justify-center text-[8px] font-bold text-black mb-2 z-10">{initials}</div>
                  <div className="text-[8px] font-bold text-white mb-1 uppercase truncate w-full text-center z-10">{displayName}</div>
                  <div className="w-full h-px bg-[#1e2530] my-1 z-10" />
                  <div className="flex w-full justify-between px-1 z-10">
                    <div className="text-[6px] text-gold font-bold">{disciplinePercent}%</div>
                    <div className="text-[6px] text-white font-bold">{streak}</div>
                    <div className="text-[6px] text-blue-400 font-bold">+{completedTasks}</div>
                  </div>
                  {/* Faux task lines */}
                  <div className="w-full mt-2 space-y-1 z-10">
                    {displayTasks.slice(0,2).map((t, i) => (
                      <div key={i} className="flex items-center gap-1">
                         <div className={"size-1.5 rounded-[1px] " + (t.completed ? "bg-gold" : "border border-gold/50")} />
                         <div className="h-1 bg-white/20 rounded-full w-full" />
                      </div>
                    ))}
                  </div>
                </div>
                <p className="flex-1 text-[15px] font-medium text-gray-400 leading-snug">
                  Your mission report is ready.<br />Tap Share to send it.
                </p>
              </div>
            </div>

            {/* Metric Definitions Card */}
            <div className="rounded-2xl border border-[#1e2530] bg-[#141b26] p-5">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 mb-5 uppercase">
                <div className="flex size-4 items-center justify-center rounded-full border border-gray-500 text-[10px]">i</div>
                Metric Definitions
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1e1a0e]">
                    <Target className="size-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1 tracking-wide">DISCIPLINE</div>
                    <div className="text-[13px] font-medium text-gray-400 leading-snug">Mission completion rate. 100% = Flawless execution.</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1e110e]">
                    <Flame className="size-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1 tracking-wide">STREAK</div>
                    <div className="text-[13px] font-medium text-gray-400 leading-snug">Consecutive days completing missions.</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0e1622]">
                    <Zap className="size-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1 tracking-wide">POWER LEVEL</div>
                    <div className="text-[13px] font-medium text-gray-400 leading-snug">Daily contribution. <span className="text-blue-400">+{completedTasks}</span> per completed mission.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed CTA */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#1e2530] bg-[#0f141e] p-5">
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e2b96e] py-4 text-base font-bold text-[#080b11] hover:bg-[#d4a843] transition-colors disabled:opacity-50"
            >
              <Share2 className="size-5" />
              {isSharing ? "Generating..." : "Share"}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden element for html2canvas generation */}
      <div id="wolf-billion-card" className="absolute left-[-9999px] top-0 w-[400px] h-[700px] bg-[#080a0f] p-8 flex flex-col text-white hidden" style={{ fontFamily: "sans-serif" }}>
        <div className="flex flex-col items-center mt-4">
          <div className="size-16 rounded-full bg-gold flex items-center justify-center text-3xl font-black text-black mb-4 uppercase">{initials}</div>
          <div className="text-3xl font-black tracking-widest text-white mb-2 uppercase text-center max-w-full truncate">{displayName}</div>
          <div className="rounded border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-bold text-gold uppercase tracking-wider mb-8 flex items-center">
            <CalendarIcon className="size-3 mr-1" />
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex w-full border border-[#1e2530] bg-[#141b26] rounded-xl overflow-hidden mb-6">
          <div className="flex-1 flex flex-col items-center justify-center p-4 border-r border-[#1e2530]">
            <div className="text-xl font-black text-gold">{disciplinePercent}%</div>
            <div className="text-[9px] font-bold text-gray-400 tracking-wider mt-1">DISCIPLINE</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4 border-r border-[#1e2530]">
            <div className="text-xl font-black text-white">{streak}</div>
            <div className="text-[9px] font-bold text-gray-400 tracking-wider mt-1">STREAK</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="text-xl font-black text-blue-400">+{completedTasks}</div>
            <div className="text-[9px] font-bold text-gray-400 tracking-wider mt-1">POWER LEVEL</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-2 rounded-full bg-gold" />
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">MISSIONS LOG</div>
          </div>
          
          <div className="space-y-3">
            {displayTasks.map((task: any) => (
              <div key={task.id} className="flex items-center gap-3 bg-[#111827] rounded-lg p-3 border border-[#1e2530]">
                <div className={"flex size-5 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] " + (task.completed ? "border-gold bg-gold text-[#080b11]" : "border-gold/50")}>
                  {task.completed && <CheckSquare className="size-3" strokeWidth={3} />}
                </div>
                <div className="text-sm font-bold text-white truncate flex-1">{task.title}</div>
              </div>
            ))}
            {displayTasks.length === 0 && (
              <div className="text-sm text-gray-500 italic p-3 text-center">No missions logged today.</div>
            )}
          </div>
        </div>

        <div className="mt-auto text-center text-xs font-medium text-gray-500 mb-6 italic leading-relaxed">
          "You're going to have to work when you don't feel like working.<br/>That's how it's going to have to be, or you're never going to be<br/>important."
        </div>

        <div className="flex items-center justify-center gap-2 pb-4">
          <span className="text-sm">🪐</span>
          <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">THE REAL WORLD</span>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ChecklistPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"Checklist" | "Schedule">("Checklist");
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [quickAddGroup, setQuickAddGroup] = useState<{ id: string; name: string } | null>(null);
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [detailedGroupId, setDetailedGroupId] = useState<string | undefined>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMissionReport, setShowMissionReport] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: checklistData, isLoading: isLoadingChecklist } = useQuery({
    queryKey: ["checklist"],
    queryFn: () => getChecklistFn(),
  });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["currentProfile"],
    queryFn: () => getCurrentProfileFn(),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTaskFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklist"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTaskFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklist"] }),
  });

  const createGroupMutation = useMutation({
    mutationFn: createGroupFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklist"] }),
  });

  const createTaskMutation = useMutation({
    mutationFn: createTaskFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
      setNewTaskTitle("");
      setQuickAddGroup(null);
      setShowDetailedModal(false);
    },
  });

  const handleToggle = (id: string, completed: boolean) => toggleMutation.mutate({ data: { id, completed: !completed } });
  const handleDelete = (id: string) => deleteMutation.mutate({ data: id });

  const handleCreateGroup = () => {
    const name = window.prompt("Enter new group name:");
    if (name) createGroupMutation.mutate({ data: name });
  };

  const handleAddCampusTasks = () => {
    const campusGroup = checklistData?.checklist.find((g) => g.name === "Hustler's Campus");
    createTaskMutation.mutate({
      data: { group_id: campusGroup?.id, title: "Log in to Hustler's Campus", scheduled_time: "2:57 AM", recurrence: "Daily", icon: "Coins" },
    });
  };

  const handleQuickAdd = () => {
    if (!newTaskTitle.trim()) return;
    const firstGroup = checklistData?.checklist[0];
    createTaskMutation.mutate({ data: { group_id: firstGroup?.id, title: newTaskTitle } });
  };

  if (isLoadingChecklist || isLoadingProfile) {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading...</div>;
  }

  const profile = profileData?.profile;
  const checklist = checklistData?.checklist || [];

  return (
    <>
      {showMissionReport && (
        <MissionReportModal
          onClose={() => setShowMissionReport(false)}
          profile={profile}
          checklist={checklist}
        />
      )}

      {quickAddGroup && (
        <QuickAddModal
          groupName={quickAddGroup.name}
          isPending={createTaskMutation.isPending}
          onCancel={() => setQuickAddGroup(null)}
          onAdd={(title) => createTaskMutation.mutate({ data: { group_id: quickAddGroup.id, title } })}
        />
      )}

      {showDetailedModal && (
        <DetailedTaskModal
          groupId={detailedGroupId}
          timezone={profile?.timezone}
          isPending={createTaskMutation.isPending}
          onClose={() => setShowDetailedModal(false)}
          onAdd={(data) => createTaskMutation.mutate({ data } as any)}
        />
      )}

      <div className="flex min-h-screen flex-col bg-[#0a0a0f] text-white pb-24 font-sans">
        {/* Tabs */}
        <div className="flex border-b border-[#1f2d3d] bg-[#0a0a0f]">
          <button
            className={"flex-1 py-4 text-center text-sm font-bold flex items-center justify-center gap-2 transition-colors " + (activeTab === "Checklist" ? "border-b-2 border-gold text-white" : "text-gray-500 hover:text-gray-300")}
            onClick={() => setActiveTab("Checklist")}
          >
            {activeTab === "Checklist" && <Pin className="size-4" fill="currentColor" />}
            Checklist
          </button>
          <button
            className={"flex-1 py-4 text-center text-sm font-bold transition-colors " + (activeTab === "Schedule" ? "border-b-2 border-gold text-white" : "text-gray-500 hover:text-gray-300")}
            onClick={() => setActiveTab("Schedule")}
          >
            Schedule
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
          {activeTab === "Checklist" ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-start gap-3 rounded-xl bg-[#141b26] border border-[#1f2d3d] px-3 py-2">
                  <Clock className="size-4 text-gray-500 shrink-0 mt-[2px]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-wide text-gray-200">
                      {currentTime.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <span className="text-xs font-medium text-gray-500 text-right">{profile?.daily_reset_time || "12:00 AM"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 rounded-lg bg-[#141b26] px-4 py-2 text-sm font-bold text-gold hover:bg-[#1c2335] transition-colors">
                    <Share2 className="size-4" /> Share
                  </button>
                  <button className="flex items-center gap-2 rounded-lg bg-[#141b26] px-4 py-2 text-sm font-bold text-gold hover:bg-[#1c2335] transition-colors">
                    <FileUp className="size-4" /> Import
                  </button>
                </div>
              </div>

              {/* Streak Banner */}
              {showStreakBanner && (
                <div className="relative flex items-center gap-2 rounded-xl border border-[#1f2937] bg-[#0a0a0f] px-4 py-3">
                  <Trophy className="size-4 text-gold shrink-0" fill="currentColor" />
                  <span className="text-sm font-bold text-white">
                    <span className="text-gold">+{profile?.power_progress || 0} Power Level</span> - You have maintained your login streak!
                  </span>
                  <button onClick={() => setShowStreakBanner(false)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors">&times;</button>
                </div>
              )}

              {/* Groups */}
              {checklist.map((group) => (
                <div key={group.id} className="rounded-xl border border-[#1f2937] bg-[#0a0a0f] overflow-visible">
                  <div className="flex items-center justify-between bg-[#141b26] px-4 py-4 rounded-t-2xl">
                    <h3 className="font-bold text-white text-base">{group.name}</h3>
                    <div className="relative group/tooltip">
                      <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover/tooltip:opacity-100 pointer-events-none z-10">
                        Add task to this group
                        <div className="absolute left-1/2 top-full -mt-[1px] h-0 w-0 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-black" />
                      </div>
                      <button onClick={() => setQuickAddGroup({ id: group.id, name: group.name })} className="text-gray-400 hover:text-white p-1">
                        <Plus className="size-5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-[#252d3d] border-t border-[#252d3d]">
                    {group.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors group">
                        <button
                          onClick={() => handleToggle(task.id, task.completed)}
                          className={"flex size-6 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors " + (task.completed ? "border-gold bg-gold text-[#080b11]" : "border-gold/80 hover:border-gold bg-transparent")}
                        >
                          {task.completed && <CheckSquare className="size-4" strokeWidth={3} />}
                        </button>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center gap-2">
                            {task.icon === "Coins" && <span className="text-lg">💰</span>}
                            <span className={"text-[15px] font-bold " + (task.completed ? "text-gray-500 line-through" : "text-gray-100")}>{task.title}</span>
                          </div>
                          {(task.scheduled_time || task.recurrence) && (
                            <div className="mt-1 flex items-center gap-2 text-[13px] font-semibold text-gray-400">
                              {task.scheduled_time && <span className="flex items-center gap-1.5"><CalendarIcon className="size-3.5" /> Scheduled for {task.scheduled_time}</span>}
                              {task.recurrence && <span className="flex items-center gap-1.5 text-emerald-400"><span>&#10227;</span> {task.recurrence}</span>}
                            </div>
                          )}
                        </div>
                        <button onClick={() => handleDelete(task.id)} className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                    {group.tasks.length === 0 && (
                      <button onClick={() => setQuickAddGroup({ id: group.id, name: group.name })} className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-white/[0.04] transition-colors">
                        <span className="text-[15px] font-medium text-gray-500">Add a task</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="space-y-3 pt-2 pb-6">
                <button onClick={handleCreateGroup} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#141b26] border border-[#1f2d3d] py-4 text-sm font-bold text-white hover:bg-[#1c2335] transition-colors">
                  <Plus className="size-5" /> Create Group
                </button>
                <button onClick={handleAddCampusTasks} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#141b26] border border-[#1f2d3d] py-4 text-sm font-bold text-white hover:bg-[#1c2335] transition-colors">
                  <Building2 className="size-5" /> Add Campus Tasks
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <button className="p-2 text-gray-500 hover:text-white transition-colors">&lt;</button>
                <h2 className="text-lg font-bold text-white">Today, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}</h2>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-gray-500 hover:text-white transition-colors">&gt;</button>
                  <button className="p-2 text-gray-500 hover:text-white transition-colors"><CalendarIcon className="size-5" /></button>
                </div>
              </div>
              <div className="rounded-xl border border-[#1f2937] bg-[#0a0a0f] px-4 py-3">
                <select className="w-full bg-transparent text-sm font-medium text-gray-400 outline-none appearance-none" value={profile?.timezone || "UTC"} disabled>
                  <option value={profile?.timezone || "UTC"}>Local - {profile?.timezone || "UTC"}</option>
                </select>
              </div>
              <div className="rounded-xl border border-[#1f2937] bg-[#0a0a0f] overflow-hidden">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="flex border-b border-[#1f2d3d] last:border-b-0 h-16">
                    <div className="w-16 border-r border-[#1f2d3d] flex justify-center py-2 text-xs font-medium text-gray-600">{i.toString().padStart(2, "0")}</div>
                    <div className="flex-1 relative" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Bottom Input */}
        {activeTab === "Checklist" && (
          <div className="fixed bottom-0 left-0 right-0 border-t border-[#1f2d3d] bg-[#0a0a0f] p-4 md:static md:pb-4 flex gap-3 z-40">
            <div className="flex-1 flex items-center rounded-lg border border-gold/40 focus-within:border-gold bg-[#0a0a0f] px-4 transition-colors">
              <input
                type="text"
                placeholder="Describe your task"
                className="w-full bg-transparent py-4 text-[15px] font-medium text-white placeholder-gray-500 outline-none"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
              />
              <button
                className="ml-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => { setDetailedGroupId(checklist[0]?.id); setShowDetailedModal(true); }}
              >
                <CalendarIcon className="size-5" />
              </button>
            </div>
            <button
              onClick={handleQuickAdd}
              disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
              className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#e2b96e] text-[#080b11] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <ArrowUp className="size-6" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
