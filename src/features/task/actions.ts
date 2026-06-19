"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createTaskService } from "./services";
import {
  TaskSectionSchema,
  TaskSectionUpdateSchema,
  TaskSchema,
  TaskUpdateSchema,
  TaskAssigneeSchema,
} from "./validations";
import { z } from "zod";

export async function createSectionAction(payload: unknown) {
  try {
    const data = TaskSectionSchema.parse(payload);
    const supabase = await createClient();
    const service = createTaskService(supabase);

    const section = await service.createSection(data.workspace_id, data.name);
    revalidatePath(`/${data.workspace_id}/tasks`);
    console.log(section)
    return { success: true, data: section };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSectionAction(payload: unknown) {
  try {
    const data = TaskSectionUpdateSchema.parse(payload);
    const supabase = await createClient();
    const service = createTaskService(supabase);

    if (!data.name) throw new Error("Name is required to update");
    const section = await service.updateSection(data.id, data.name);
    revalidatePath(`/${section.workspace_id}/tasks`);
    return { success: true, data: section };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSectionAction(sectionId: string, workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createTaskService(supabase);

    await service.deleteSection(sectionId);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderSectionsAction(payload: unknown, workspaceId: string) {
  try {
    const ReorderSchema = z.array(z.object({ id: z.string().uuid(), sort_order: z.number() }));
    const data = ReorderSchema.parse(payload);
    const supabase = await createClient();
    const service = createTaskService(supabase);

    await service.reorderSections(data);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTaskAction(payload: unknown) {
  try {
    const data = TaskSchema.parse(payload);
    const supabase = await createClient();
    const service = createTaskService(supabase);

    const task = await service.createTask(
      data.workspace_id,
      data.section_id || null,
      data.title,
      data.description || null,
      data.status,
      data.priority,
      data.due_date || null,
      data.parent_id || null
    );
    revalidatePath(`/${data.workspace_id}/tasks`);
    console.log(task)
    return { success: true, data: task };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTaskAction(payload: unknown, workspaceId: string) {
  try {
    const data = TaskUpdateSchema.parse(payload);
    const supabase = await createClient();
    const service = createTaskService(supabase);

    const { id, workspace_id, ...updates } = data;
    const task = await service.updateTask(id, updates);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true, data: task };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTaskAction(taskId: string, workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createTaskService(supabase);

    await service.deleteTask(taskId);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reorderTasksAction(payload: unknown, workspaceId: string) {
  try {
    const ReorderSchema = z.array(z.object({ id: z.string().uuid(), sort_order: z.number(), sectionId: z.string().uuid().nullable() }));
    const data = ReorderSchema.parse(payload);
    const supabase = await createClient();
    const service = createTaskService(supabase);

    await service.reorderTasks(data);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleTaskCompletionAction(taskId: string, completed: boolean, workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createTaskService(supabase);

    const task = await service.toggleTaskCompletion(taskId, completed);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true, data: task };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markTaskViewedAction(taskId: string, userId: string, workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createTaskService(supabase);

    await service.markTaskViewed(taskId, userId);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markTaskReviewedAction(taskId: string, userId: string, workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createTaskService(supabase);

    await service.markTaskReviewed(taskId, userId);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignUserAction(payload: unknown, workspaceId: string) {
  try {
    const data = TaskAssigneeSchema.parse(payload);
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Unauthorized");

    const service = createTaskService(supabase);
    await service.assignUser(data.task_id, data.user_id, userData.user.id);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unassignUserAction(taskId: string, userId: string, workspaceId: string) {
  try {
    const supabase = await createClient();
    const service = createTaskService(supabase);

    await service.unassignUser(taskId, userId);
    revalidatePath(`/${workspaceId}/tasks`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
