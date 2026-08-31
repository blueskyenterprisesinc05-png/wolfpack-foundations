import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { getSessionFn } from "./auth";
import { createServerClient } from "./supabase/server";

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

export const getChecklistFn = createServerFn("GET", async () => {
  const { session } = await getSessionFn();
  if (!session) throw new Error("Unauthorized");

  const supabase = createServerClient();

  const [groupsRes, tasksRes] = await Promise.all([
    supabase
      .from("checklist_groups")
      .select("*")
      .eq("user_id", session.user.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("checklist_tasks")
      .select("*")
      .eq("user_id", session.user.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (groupsRes.error) throw groupsRes.error;
  if (tasksRes.error) throw tasksRes.error;

  const groups = groupsRes.data as Omit<ChecklistGroup, "tasks">[];
  const tasks = tasksRes.data as ChecklistTask[];

  const checklist: ChecklistGroup[] = groups.map((group) => ({
    ...group,
    tasks: tasks.filter((task) => task.group_id === group.id),
  }));

  // Handle tasks without a group by creating a virtual "Uncategorized" group if they exist
  const ungroupedTasks = tasks.filter((task) => !task.group_id);
  if (ungroupedTasks.length > 0) {
    checklist.push({
      id: "ungrouped",
      user_id: session.user.id,
      name: "Uncategorized",
      position: 9999,
      created_at: new Date().toISOString(),
      tasks: ungroupedTasks,
    });
  }

  return { checklist };
});

export const createGroupFn = createServerFn("POST", async (name: string) => {
  const { session } = await getSessionFn();
  if (!session) throw new Error("Unauthorized");

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("checklist_groups")
    .insert({
      user_id: session.user.id,
      name,
    })
    .select()
    .single();

  if (error) throw error;
  return { group: data };
});

const createTaskSchema = z.object({
  group_id: z.string().optional(),
  title: z.string().min(1),
  scheduled_time: z.string().optional(),
  recurrence: z.string().optional(),
  icon: z.string().optional(),
});

export const createTaskFn = createServerFn("POST", async (input: z.infer<typeof createTaskSchema>) => {
  const { session } = await getSessionFn();
  if (!session) throw new Error("Unauthorized");

  const { group_id, title, scheduled_time, recurrence, icon } = createTaskSchema.parse(input);

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("checklist_tasks")
    .insert({
      user_id: session.user.id,
      group_id,
      title,
      scheduled_time,
      recurrence,
      icon,
    })
    .select()
    .single();

  if (error) throw error;
  return { task: data };
});

export const toggleTaskFn = createServerFn("POST", async ({ id, completed }: { id: string; completed: boolean }) => {
  const { session } = await getSessionFn();
  if (!session) throw new Error("Unauthorized");

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("checklist_tasks")
    .update({ completed })
    .eq("id", id)
    .eq("user_id", session.user.id) // Security check
    .select()
    .single();

  if (error) throw error;
  return { task: data };
});

export const deleteTaskFn = createServerFn("POST", async (id: string) => {
  const { session } = await getSessionFn();
  if (!session) throw new Error("Unauthorized");

  const supabase = createServerClient();
  const { error } = await supabase
    .from("checklist_tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) throw error;
  return { success: true };
});
