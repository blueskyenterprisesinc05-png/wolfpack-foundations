import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Plus, CheckSquare, Trash2, Calendar as CalendarIcon, Coins, Building2, ArrowUp, Share2, FileUp, Clock, Pin } from "lucide-react";
import { getChecklistFn, toggleTaskFn, deleteTaskFn, createGroupFn, createTaskFn } from "@/lib/checklist";
import { getCurrentProfileFn } from "@/lib/profile";

export function ChecklistPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"Checklist" | "Schedule">("Checklist");
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
  // Current time state for the top left clock
  const [currentTime, setCurrentTime] = useState(new Date());

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
      data: {
        group_id: groupId,
        title: "Log in to Hustler's Campus",
        scheduled_time: "2:57 AM",
        recurrence: "Daily",
        icon: "Coins",
      }
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
    <div className="flex min-h-screen flex-col bg-[#0b0e14] text-white pb-24 font-sans">
      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-[#0b0e14]">
        <button
          className={`flex-1 py-4 text-center text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "Checklist" ? "border-b-2 border-gold text-white" : "text-gray-500 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("Checklist")}
        >
          {activeTab === "Checklist" && <Pin className="size-4" fill="currentColor" />}
          Checklist
        </button>
        <button
          className={`flex-1 py-4 text-center text-sm font-bold transition-colors ${
            activeTab === "Schedule" ? "border-b-2 border-gold text-white" : "text-gray-500 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("Schedule")}
        >
          Schedule
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        {activeTab === "Checklist" ? (
          <div className="space-y-4">
            
            {/* Header: Time & Actions */}
            <div className="flex items-center justify-between pb-2">
               <div className="flex items-center gap-2">
                  <Clock className="size-5 text-gray-500" />
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-gray-300">
                       {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                     </span>
                     <span className="text-xs font-semibold text-gray-600">
                       {profile?.daily_reset_time || "12:00 AM"}
                     </span>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="flex items-center gap-2 rounded-lg bg-[#141923] px-4 py-2 text-sm font-bold text-gold transition-colors hover:bg-[#1a202c]">
                     <Share2 className="size-4" /> Share
                  </button>
                  <button className="flex items-center gap-2 rounded-lg bg-[#141923] px-4 py-2 text-sm font-bold text-gold transition-colors hover:bg-[#1a202c]">
                     <FileUp className="size-4" /> Import
                  </button>
               </div>
            </div>

            {/* Streak Banner */}
            {showStreakBanner && (
              <div className="relative flex items-center gap-2 rounded-xl border border-[#1f2937] bg-[#0b0e14] px-4 py-3 shadow-sm">
                <Trophy className="size-4.5 text-gold shrink-0" fill="currentColor" />
                <span className="text-sm font-bold text-white">
                  <span className="text-gold">+{profile?.power_progress || 0} Power Level</span> - You have maintained your login streak!
                </span>
                <button
                  onClick={() => setShowStreakBanner(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Groups */}
            {checklist.map((group) => (
              <div key={group.id} className="rounded-xl border border-[#1f2937] bg-[#0b0e14] overflow-visible">
                {/* Group Header (Darker) */}
                <div className="flex items-center justify-between bg-[#080b11] px-4 py-4 rounded-t-xl">
                  <h3 className="font-bold text-white text-base">{group.name}</h3>
                  <div className="relative group/tooltip">
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover/tooltip:opacity-100 pointer-events-none z-10">
                      Add task to this group
                      {/* Tooltip arrow */}
                      <div className="absolute left-1/2 top-full -mt-[1px] h-0 w-0 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-black"></div>
                    </div>
                    <button
                      onClick={() => {
                        const title = window.prompt("Add task to " + group.name + ":");
                        if (title) createTaskMutation.mutate({ data: { group_id: group.id, title } });
                      }}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Plus className="size-5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Tasks Container (Lighter/Base) */}
                <div className="divide-y divide-[#1f2937] border-t border-[#1f2937]">
                  {group.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors group">
                      <button
                        onClick={() => handleToggle(task.id, task.completed)}
                        className={`flex size-6 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors ${
                          task.completed
                            ? "border-gold bg-gold text-[#080b11]"
                            : "border-gold/80 hover:border-gold bg-transparent"
                        }`}
                      >
                        {task.completed && <CheckSquare className="size-4" strokeWidth={3} />}
                      </button>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          {task.icon === "Coins" ? (
                            <span className="text-lg">💰</span>
                          ) : null}
                          <span className={`text-[15px] font-bold ${task.completed ? "text-gray-500 line-through" : "text-gray-100"}`}>
                            {task.title}
                          </span>
                        </div>
                        {(task.scheduled_time || task.recurrence) && (
                          <div className="mt-1 flex items-center gap-2 text-[13px] font-semibold text-gray-400">
                            {task.scheduled_time && (
                              <span className="flex items-center gap-1.5">
                                <CalendarIcon className="size-3.5" /> Scheduled for {task.scheduled_time}
                              </span>
                            )}
                            {task.recurrence && (
                              <span className="flex items-center gap-1.5 text-emerald-400">
                                <span className="text-[12px]">&#10227;</span> {task.recurrence}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="flex size-9 items-center justify-center rounded-lg bg-[#141923] text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Trash2 className="size-4.5" />
                      </button>
                    </div>
                  ))}
                  {group.tasks.length === 0 && (
                    <div className="flex items-center gap-3 px-4 py-4">
                       <span className="text-[15px] font-bold text-white">Add a task</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="space-y-3 pt-2 pb-6">
              <button
                onClick={handleCreateGroup}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#080b11] border border-[#1f2937] py-4 text-sm font-bold text-white transition-colors hover:bg-[#141923]"
              >
                <Plus className="size-5" />
                Create Group
              </button>
              <button
                onClick={handleAddCampusTasks}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#080b11] border border-[#1f2937] py-4 text-sm font-bold text-white transition-colors hover:bg-[#141923]"
              >
                <Building2 className="size-5" />
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

            <div className="rounded-xl border border-[#1f2937] bg-[#0b0e14] px-4 py-3">
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

            {/* Time Grid */}
            <div className="rounded-xl border border-[#1f2937] bg-[#0b0e14] overflow-hidden">
               {[...Array(24)].map((_, i) => (
                  <div key={i} className="flex border-b border-[#1f2937] last:border-b-0 h-16 group">
                     <div className="w-16 border-r border-[#1f2937] flex justify-center py-2 text-xs font-medium text-gray-600">
                        {i.toString().padStart(2, '0')}
                     </div>
                     <div className="flex-1 relative">
                        {/* Task blocks */}
                     </div>
                  </div>
               ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Input */}
      {activeTab === "Checklist" && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#1f2937] bg-[#080b11] p-4 pb-safe md:static md:pb-4 flex gap-3 z-50">
          <div className="flex-1 flex items-center rounded-lg border border-gold/40 focus-within:border-gold bg-[#0b0e14] px-4 transition-colors">
            <input
              type="text"
              placeholder="Describe your task"
              className="w-full bg-transparent py-4 text-[15px] font-medium text-white placeholder-gray-500 outline-none"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
            />
            <button className="ml-2 text-gray-400 hover:text-white transition-colors">
              <CalendarIcon className="size-5" />
            </button>
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
            className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#e2b96e] text-[#080b11] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <ArrowUp className="size-6" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
