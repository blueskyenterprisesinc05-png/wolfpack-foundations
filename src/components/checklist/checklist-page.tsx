import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Plus, CheckSquare, Trash2, Calendar as CalendarIcon, Coins, FileText, ArrowUp } from "lucide-react";
import { getChecklistFn, toggleTaskFn, deleteTaskFn, createGroupFn, createTaskFn } from "@/lib/checklist";
import { getCurrentProfileFn } from "@/lib/profile";

export function ChecklistPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"Checklist" | "Schedule">("Checklist");
  const [showStreakBanner, setShowStreakBanner] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  // Simple state to track which group's tooltip is open, or use CSS group hover
  // Using pure CSS group-hover for the tooltip is cleaner

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTaskFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: createGroupFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTaskFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
      setNewTaskTitle("");
    },
  });

  const handleToggle = (id: string, completed: boolean) => {
    toggleMutation.mutate({ data: { id, completed: !completed } });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ data: id });
  };

  const handleCreateGroup = () => {
    const name = window.prompt("Enter new group name:");
    if (name) {
      createGroupMutation.mutate({ data: name });
    }
  };

  const handleAddCampusTasks = () => {
    const campusGroup = checklistData?.checklist.find((g) => g.name === "Hustler's Campus");
    const groupId = campusGroup?.id;
    
    createTaskMutation.mutate({
      group_id: groupId,
      title: "Log in to Hustler's Campus",
      scheduled_time: "02:57 AM", // Adjusting format
      recurrence: "Daily",
      icon: "Coins",
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
    <div className="flex min-h-screen flex-col bg-[#080b11] text-white pb-24 font-sans">
      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-[#080b11] px-4">
        <button
          className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${
            activeTab === "Checklist" ? "border-b-2 border-gold text-gold" : "text-gray-500 hover:text-white"
          }`}
          onClick={() => setActiveTab("Checklist")}
        >
          Checklist
        </button>
        <button
          className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${
            activeTab === "Schedule" ? "border-b-2 border-gold text-gold" : "text-gray-500 hover:text-white"
          }`}
          onClick={() => setActiveTab("Schedule")}
        >
          Schedule
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        {activeTab === "Checklist" ? (
          <div className="space-y-4">
            {/* Streak Banner */}
            {showStreakBanner && (
              <div className="relative rounded-xl bg-gradient-to-r from-[#111827] to-[#0a0f1a] border border-[#1f2937] p-4 pr-10">
                <button
                  onClick={() => setShowStreakBanner(false)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-white"
                >
                  &times;
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gold/10">
                    <Trophy className="size-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      +{profile?.power_progress || 0} Power Level - You have maintained your login streak!
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Groups */}
            {checklist.map((group) => (
              <div key={group.id} className="rounded-xl bg-[#0f141e] border border-white/5 overflow-visible">
                <div className="flex items-center justify-between px-4 py-4">
                  <h3 className="font-bold text-white text-base">{group.name}</h3>
                  <div className="relative group">
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10">
                      Add task to this group
                      {/* Tooltip arrow */}
                      <div className="absolute left-1/2 top-full -mt-[1px] h-0 w-0 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-black"></div>
                    </div>
                    <button
                      onClick={() => {
                        const title = window.prompt("Add task to " + group.name + ":");
                        if (title) createTaskMutation.mutate({ data: { group_id: group.id, title } });
                      }}
                      className="text-gray-500 hover:text-white p-1"
                    >
                      <Plus className="size-4" strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-white/5 border-t border-white/5 bg-[#0c1018]/50">
                  {group.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                      <button
                        onClick={() => handleToggle(task.id, task.completed)}
                        className={`flex size-[22px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors ${
                          task.completed
                            ? "border-gold bg-gold text-[#080b11]"
                            : "border-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {task.completed && <CheckSquare className="size-3.5" strokeWidth={3} />}
                      </button>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          {task.icon === "Coins" ? (
                            <Coins className="size-4 text-gold shrink-0" />
                          ) : null}
                          <span className={`text-sm font-semibold ${task.completed ? "text-gray-500 line-through" : "text-gray-200"}`}>
                            {task.title}
                          </span>
                        </div>
                        {(task.scheduled_time || task.recurrence) && (
                          <div className="mt-1.5 flex items-center gap-3 text-xs font-medium text-gray-500">
                            {task.scheduled_time && (
                              <span className="flex items-center gap-1.5">
                                <CalendarIcon className="size-3.5" /> Scheduled for {task.scheduled_time}
                              </span>
                            )}
                            {task.recurrence && (
                              <span className="flex items-center gap-1.5 text-emerald-500">
                                <span className="text-[10px]">&#10227;</span> {task.recurrence}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                  {group.tasks.length === 0 && (
                    <div className="flex items-center gap-3 p-4">
                       <div className="size-[22px] rounded-[4px] border-[1.5px] border-gray-700/50"></div>
                       <span className="text-sm font-semibold text-gray-600">Add a task</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleCreateGroup}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f141e] border border-white/5 py-4 text-sm font-bold text-gray-400 transition-colors hover:text-white hover:bg-[#151b29]"
              >
                <Plus className="size-5" />
                Create Group
              </button>
              <button
                onClick={handleAddCampusTasks}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f141e] border border-white/5 py-4 text-sm font-bold text-gray-400 transition-colors hover:text-white hover:bg-[#151b29]"
              >
                <FileText className="size-4" />
                Add Campus Tasks
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Schedule View */}
            <div className="flex items-center justify-between px-2">
              <button className="p-2 text-gray-500 hover:text-white transition-colors">&lt;</button>
              <h2 className="text-lg font-bold text-white">
                 Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </h2>
              <div className="flex items-center gap-1">
                 <button className="p-2 text-gray-500 hover:text-white transition-colors">&gt;</button>
                 <button className="p-2 text-gray-500 hover:text-white transition-colors">
                    <CalendarIcon className="size-5" />
                 </button>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#0f141e] px-4 py-3">
              <select 
                className="w-full bg-transparent text-sm font-medium text-gray-400 outline-none appearance-none"
                value={profile?.timezone || "UTC"}
                disabled
              >
                <option value={profile?.timezone || "UTC"}>
                  Local - {profile?.timezone || "UTC"}
                </option>
              </select>
            </div>

            {/* Time Grid (Simplified visual representation) */}
            <div className="rounded-xl border border-white/5 bg-[#0f141e] overflow-hidden">
               {[...Array(24)].map((_, i) => (
                  <div key={i} className="flex border-b border-white/5 last:border-b-0 h-16 group">
                     <div className="w-16 border-r border-white/5 flex justify-center py-2 text-xs font-medium text-gray-600 group-hover:text-gray-400 transition-colors">
                        {i.toString().padStart(2, '0')}
                     </div>
                     <div className="flex-1 relative">
                        {/* Task blocks would go here based on time */}
                     </div>
                  </div>
               ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Input (only in Checklist view for now) */}
      {activeTab === "Checklist" && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[#080b11] p-4 pb-safe md:static md:pb-4 flex gap-3 z-50">
          <div className="flex-1 flex items-center rounded-xl border border-[#374151] focus-within:border-gold/50 bg-[#0f141e] px-4 transition-colors">
            <input
              type="text"
              placeholder="Describe your task"
              className="w-full bg-transparent py-4 text-sm font-medium text-white placeholder-gray-600 outline-none"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
            />
            <button className="ml-2 text-gray-500 hover:text-white transition-colors">
              <CalendarIcon className="size-5" />
            </button>
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
            className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gold text-[#080b11] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <ArrowUp className="size-6" strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
}
