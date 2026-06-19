import { SupabaseClient } from "@supabase/supabase-js";
import { TaskSection, Task, TaskAssignee } from "./types";

export const createTaskService = (supabase: SupabaseClient) => ({
  async getSections(workspaceId: string): Promise<TaskSection[]> {
    const { data, error } = await supabase
      .from("task_sections")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async createSection(workspaceId: string, name: string, userId: string): Promise<TaskSection> {
    const { data: maxPosData } = await supabase
      .from("task_sections")
      .select("sort_order")
      .eq("workspace_id", workspaceId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const sort_order = maxPosData ? maxPosData.sort_order + 1024 : 1024;

    const { data, error } = await supabase
      .from("task_sections")
      .insert({ workspace_id: workspaceId, name, sort_order, created_by: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateSection(sectionId: string, name: string): Promise<TaskSection> {
    const { data, error } = await supabase
      .from("task_sections")
      .update({ name })
      .eq("id", sectionId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteSection(sectionId: string): Promise<void> {
    const { error } = await supabase.from("task_sections").delete().eq("id", sectionId);
    if (error) throw new Error(error.message);
  },

  async reorderSections(updates: { id: string; sort_order: number }[]): Promise<void> {
    for (const update of updates) {
      await supabase.from("task_sections").update({ sort_order: update.sort_order }).eq("id", update.id);
    }
  },

  async getTasks(workspaceId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("is_deleted", false)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async createTask(
    workspaceId: string,
    sectionId: string | null,
    title: string,
    description: string | null = null,
    status: string = "todo",
    priority: string = "none",
    dueDate: string | null = null,
    parentId: string | null = null,
    userId: string
  ): Promise<Task> {
    let sort_order = 1024;
    
    if (sectionId) {
        const { data: maxPosData } = await supabase
        .from("tasks")
        .select("sort_order")
        .eq("section_id", sectionId)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
        if (maxPosData) sort_order = maxPosData.sort_order + 1024;
    } else {
        const { data: maxPosData } = await supabase
        .from("tasks")
        .select("sort_order")
        .is("section_id", null)
        .eq("workspace_id", workspaceId)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
        if (maxPosData) sort_order = maxPosData.sort_order + 1024;
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        workspace_id: workspaceId,
        section_id: sectionId,
        parent_id: parentId,
        title,
        description,
        status,
        priority,
        due_date: dueDate,
        sort_order,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateTask(
    taskId: string,
    updates: Partial<Task>
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .update({ is_deleted: true })
      .eq("id", taskId);
    if (error) throw new Error(error.message);
  },

  async reorderTasks(updates: { id: string; sort_order: number; sectionId: string | null }[]): Promise<void> {
    for (const update of updates) {
      await supabase
        .from("tasks")
        .update({ sort_order: update.sort_order, section_id: update.sectionId })
        .eq("id", update.id);
    }
  },

  async toggleTaskCompletion(taskId: string, completed: boolean): Promise<Task> {
    const updates: Partial<Task> = { completed };
    if (completed) updates.status = 'done';
    else updates.status = 'todo';

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async markTaskViewed(taskId: string, userId: string): Promise<void> {
    const { data, error } = await supabase.from("tasks").select("viewed_by").eq("id", taskId).single();
    if (error) throw new Error(error.message);
    
    const viewers = data.viewed_by || [];
    if (!viewers.includes(userId)) {
      const newViewers = [...viewers, userId];
      await supabase.from("tasks").update({ viewed_by: newViewers }).eq("id", taskId);
    }
  },

  async markTaskReviewed(taskId: string, userId: string): Promise<void> {
    const { data, error } = await supabase.from("tasks").select("reviewed_by").eq("id", taskId).single();
    if (error) throw new Error(error.message);
    
    const reviewers = data.reviewed_by || [];
    if (!reviewers.includes(userId)) {
      const newReviewers = [...reviewers, userId];
      await supabase.from("tasks").update({ reviewed_by: newReviewers }).eq("id", taskId);
    }
  },

  async assignUser(taskId: string, userId: string, assignedBy: string): Promise<void> {
    const { error } = await supabase
      .from("task_assignees")
      .insert({ task_id: taskId, user_id: userId, assigned_by: assignedBy });

    if (error && error.code !== '23505') throw new Error(error.message);
  },

  async unassignUser(taskId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("task_assignees")
      .delete()
      .match({ task_id: taskId, user_id: userId });

    if (error) throw new Error(error.message);
  },

  async getAssignees(workspaceId: string): Promise<TaskAssignee[]> {
    const { data, error } = await supabase
      .from("task_assignees")
      .select("*, tasks!inner(workspace_id)")
      .eq("tasks.workspace_id", workspaceId);

    if (error) throw new Error(error.message);
    return data || [];
  }
});
