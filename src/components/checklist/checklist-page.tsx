import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Plus, CheckSquare, Trash2, Calendar as CalendarIcon, Coins } from "lucide-react";
import { getChecklistFn, toggleTaskFn, deleteTaskFn, createGroupFn, createTaskFn } from "@/lib/checklist";
import { getCurrentProfileFn } from "@/lib/profile";

export function ChecklistPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"Checklist" | "Schedule">("Checklist");
  const [showStreakBanner, setShowStreakBanner] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");

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
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCreateGroup = () => {
    const name = window.prompt("Enter new group name:");
    if (name) {
      createGroupMutation.mutate(name);
    }
  };

  const handleAddCampusTasks = () => {
    const campusGroup = checklistData?.checklist.find((g) => g.name === "Hustler's Campus");
    const groupId = campusGroup?.id;
    
    createTaskMutation.mutate({
      group_id: groupId,
      title: "Log in to Hustler's Campus",
      scheduled_time: "02:57",
      recurrence: "Daily",
      icon: "Coins",
    });
  };

  const handleQuickAdd = () => {
    if (!newTaskTitle.trim()) return;
    const firstGroup = checklistData?.checklist[0];
    createTaskMutation.mutate({
      group_id: firstGroup?.id,
      title: newTaskTitle,
    });
  };

  if (isLoadingChecklist || isLoadingProfile) {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading...</div>;
  }

  const profile = profileData?.profile;
  const checklist = checklistData?.checklist || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#080b11] text-white pb-24 font-sans">
      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-[#0d121c] px-4">
        <button
          className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${
            activeTab === "Checklist" ? "border-b-2 border-gold text-gold" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("Checklist")}
        >
          Checklist
        </button>
        <button
          className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${
            activeTab === "Schedule" ? "border-b-2 border-gold text-gold" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("Schedule")}
        >
          Schedule
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        {activeTab === "Checklist" ? (
          <div className="space-y-6">
            {/* Streak Banner */}
            {showStreakBanner && (
              <div className="relative rounded-xl border border-gold/20 bg-[#111827] p-4 pr-10 shadow-lg">
                <button
                  onClick={() => setShowStreakBanner(false)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  &times;
                </button>
                <div className="flex items-start gap-3">
                  <Trophy className="size-6 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white">
                      +{profile?.power_progress || 0} Power Level - You have maintained your login streak!
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Groups */}
            {checklist.map((group) => (
              <div key={group.id} className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
                <div className="flex items-center justify-between bg-white/5 px-4 py-3">
                  <h3 className="font-bold text-white">{group.name}</h3>
                  <button
                    onClick={() => {
                      const title = window.prompt(\`Add task to \${group.name}:\`);
                      if (title) createTaskMutation.mutate({ group_id: group.id, title });
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <Plus className="size-5" />
                  </button>
                </div>

                <div className="divide-y divide-white/5">
                  {group.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-4">
                      <button
                        onClick={() => handleToggle(task.id, task.completed)}
                        className={`flex size-6 shrink-0 items-center justify-center rounded border transition-colors ${
                          task.completed
                            ? "border-gold bg-gold text-[#080b11]"
                            : "border-gray-500 hover:border-white"
                        }`}
                      >
                        {task.completed && <CheckSquare className="size-4" />}
                      </button>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          {task.icon === "Coins" ? (
                            <Coins className="size-4 text-gold shrink-0" />
                          ) : null}
                          <span className={`font-semibold ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
                            {task.title}
                          </span>
                        </div>
                        {(task.scheduled_time || task.recurrence) && (
                          <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                            {task.scheduled_time && (
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="size-3" /> Scheduled for {task.scheduled_time}
                              </span>
                            )}
                            {task.recurrence && (
                              <span className="flex items-center gap-1 text-[#22c55e]">
                                <span>&#8644;</span> {task.recurrence}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                  {group.tasks.length === 0 && (
                    <div className="p-4 text-sm text-gray-500">No tasks in this group.</div>
                  )}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleCreateGroup}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111827] py-4 font-bold text-white transition-colors hover:bg-white/5"
              >
                <Plus className="size-5" />
                Create Group
              </button>
              <button
                onClick={handleAddCampusTasks}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111827] py-4 font-bold text-white transition-colors hover:bg-white/5"
              >
                <CheckSquare className="size-5" />
                Add Campus Tasks
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Schedule View */}
            <div className="flex items-center justify-between">
              <button className="text-gray-400 hover:text-white">&lt;</button>
              <h2 className="text-xl font-bold">Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
              <div className="flex gap-4">
                 <button className="text-gray-400 hover:text-white">&gt;</button>
                 <button className="text-gray-400 hover:text-white">
                    <CalendarIcon className="size-5" />
                 </button>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#111827] p-3">
              <select 
                className="w-full bg-transparent text-sm text-gray-300 outline-none"
                value={profile?.timezone || "UTC"}
                disabled
              >
                <option value={profile?.timezone || "UTC"}>
                  Local - {profile?.timezone || "UTC"}
                </option>
              </select>
            </div>

            {/* Time Grid (Simplified visual representation) */}
            <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
               {[...Array(24)].map((_, i) => (
                  <div key={i} className="flex border-b border-white/5 last:border-b-0 h-16">
                     <div className="w-16 border-r border-white/5 flex justify-center py-2 text-sm text-gray-500 font-medium">
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
        <div className="sticky bottom-[4rem] border-t border-white/10 bg-[#0d121c] p-4 flex gap-3">
          <div className="flex-1 flex items-center rounded-lg border border-gold/40 bg-[#111827] px-3 focus-within:border-gold">
            <input
              type="text"
              placeholder="Describe your task"
              className="w-full bg-transparent py-3 text-sm text-white placeholder-gray-500 outline-none"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
            />
            <button className="text-gray-400 hover:text-white px-2">
              <CalendarIcon className="size-5" />
            </button>
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
            className="flex items-center justify-center rounded-lg bg-gold px-4 text-black font-bold transition-colors hover:bg-gold-tint disabled:opacity-50"
          >
            &uarr;
          </button>
        </div>
      )}
    </div>
  );
}
