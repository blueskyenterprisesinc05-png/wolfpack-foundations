import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase/server";

export type ChecklistTask = {
  id: string;
  user_id: string;
  group_id: string;
  title: string;
  completed: boolean;
  scheduled_time: string | null;
  recurrence: string | null;
  icon: string | null;
  position: number;
  created_at: string;
};

export type ChecklistGroup = {
  id: string;
  user_id: string;
  name: string;
  position: number;
  created_at: string;
  tasks: ChecklistTask[];
};

export const getChecklistFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const [groupsRes, tasksRes] = await Promise.all([
    supabase
      .from("checklist_groups")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("checklist_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (groupsRes.error) throw groupsRes.error;
  if (tasksRes.error) throw tasksRes.error;

  let groups = groupsRes.data as Omit<ChecklistGroup, "tasks">[];
  let tasks = tasksRes.data as ChecklistTask[];
  
  // Seed default groups if none exist
  if (groups.length === 0) {
    const { data: defaultGroups } = await supabase
      .from("checklist_groups")
      .insert([
        { user_id: user.id, name: "General Tasks", position: 0 },
        { user_id: user.id, name: "Hustler's Campus", position: 1 }
      ])
      .select();
      
    if (defaultGroups) {
      groups = defaultGroups as Omit<ChecklistGroup, "tasks">[];
    }
  }

  const checklist: ChecklistGroup[] = groups.map((group) => ({
    ...group,
    tasks: tasks.filter((task) => task.group_id === group.id),
  }));

  // Handle tasks without a group
  const ungroupedTasks = tasks.filter((task) => !task.group_id);
  if (ungroupedTasks.length > 0) {
    checklist.push({
      id: "ungrouped",
      user_id: user.id,
      name: "Uncategorized",
      position: 9999,
      created_at: new Date().toISOString(),
      tasks: ungroupedTasks,
    });
  }

  return { checklist };
});

export const createGroupFn = createServerFn({ method: "POST" })
  .validator((name: string) => name)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: newGroup, error } = await supabase
      .from("checklist_groups")
      .insert({
        user_id: user.id,
        name: data,
      })
      .select()
      .single();

    if (error) throw error;
    return { group: newGroup };
});

const createTaskSchema = z.object({
  group_id: z.string().optional(),
  title: z.string().min(1),
  scheduled_time: z.string().optional(),
  recurrence: z.string().optional(),
  icon: z.string().optional(),
});

export const createTaskFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof createTaskSchema>) => createTaskSchema.parse(input))
  .handler(async ({ data: input }) => {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { group_id, title, scheduled_time, recurrence, icon } = input;

    const { data: newTask, error } = await supabase
      .from("checklist_tasks")
      .insert({
        user_id: user.id,
        group_id,
        title,
        scheduled_time,
        recurrence,
        icon,
      })
      .select()
      .single();

    if (error) throw error;
    return { task: newTask };
});

export const toggleTaskFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; completed: boolean }) => input)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: updatedTask, error } = await supabase
      .from("checklist_tasks")
      .update({ completed: data.completed })
      .eq("id", data.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return { task: updatedTask };
});

export const deleteTaskFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("checklist_tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    return { success: true };
});
