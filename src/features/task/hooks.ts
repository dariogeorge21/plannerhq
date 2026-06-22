import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { createTaskService } from "./services";
import { useEffect } from "react";
import {
  createSectionAction,
  updateSectionAction,
  deleteSectionAction,
  reorderSectionsAction,
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
  reorderTasksAction,
  toggleTaskCompletionAction,
  assignUserAction,
  unassignUserAction,
  markTaskViewedAction,
  markTaskReviewedAction
} from "./actions";
import { Task, TaskSection } from "./types";

export function useTaskRealtime(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;

    const supabase = createClient();
    
    const channel = supabase
      .channel(`workspace-${workspaceId}-tasks`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `workspace_id=eq.${workspaceId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "task_sections",
          filter: `workspace_id=eq.${workspaceId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["task_sections", workspaceId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, queryClient]);
}

export function useTaskSections(workspaceId: string | undefined) {
  useTaskRealtime(workspaceId);
  return useQuery({
    queryKey: ["task_sections", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const supabase = createClient();
      const service = createTaskService(supabase);
      return service.getSections(workspaceId);
    },
    enabled: !!workspaceId,
  });
}

export function useTasks(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const supabase = createClient();
      const service = createTaskService(supabase);
      return service.getTasks(workspaceId);
    },
    enabled: !!workspaceId,
  });
}

export function useTaskAssignees(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["task_assignees", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const supabase = createClient();
      const service = createTaskService(supabase);
      return service.getAssignees(workspaceId);
    },
    enabled: !!workspaceId,
  });
}

export function useCreateTaskSection(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createSectionAction({ workspace_id: workspaceId, name, sort_order: 0 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task_sections", workspaceId] }),
  });
}

export function useUpdateTaskSection(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; name: string }) => updateSectionAction({ id: data.id, name: data.name, workspace_id: workspaceId, sort_order: 0 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task_sections", workspaceId] }),
  });
}

export function useDeleteTaskSection(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: string) => deleteSectionAction(sectionId, workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task_sections", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}

export function useReorderTaskSections(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: { id: string; sort_order: number }[]) =>
      reorderSectionsAction(updates, workspaceId),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["task_sections", workspaceId] });
      const previous = queryClient.getQueryData<TaskSection[]>(["task_sections", workspaceId]);

      if (previous) {
        const updated = previous.map((sec) => {
          const update = updates.find((u) => u.id === sec.id);
          return update ? { ...sec, sort_order: update.sort_order } : sec;
        }).sort((a, b) => a.sort_order - b.sort_order);

        queryClient.setQueryData(["task_sections", workspaceId], updated);
      }
      return { previous };
    },
    onError: (err, newTodo, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["task_sections", workspaceId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["task_sections", workspaceId] });
    },
  });
}

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; section_id?: string | null; parent_id?: string | null; due_date?: string | null }) =>
      createTaskAction({ workspace_id: workspaceId, ...data, status: 'todo', priority: 'none', sort_order: 0 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] }),
  });
}

export function useUpdateTask(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Task> & { id: string }) =>
      updateTaskAction({ ...data, workspace_id: workspaceId }, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] }),
  });
}

export function useSetDeadline(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { taskId: string; due_date: string | null }) =>
      updateTaskAction({ id: data.taskId, due_date: data.due_date, workspace_id: workspaceId }, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] }),
  });
}

export function useDeleteTask(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteTaskAction(taskId, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] }),
  });
}

export function useReorderTasks(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: { id: string; sort_order: number; sectionId: string | null }[]) =>
      reorderTasksAction(updates, workspaceId),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", workspaceId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", workspaceId]);

      if (previous) {
        const updated = previous.map((task) => {
          const update = updates.find((u) => u.id === task.id);
          return update ? { ...task, sort_order: update.sort_order, section_id: update.sectionId } : task;
        }).sort((a, b) => a.sort_order - b.sort_order);

        queryClient.setQueryData(["tasks", workspaceId], updated);
      }
      return { previous };
    },
    onError: (err, newTodo, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks", workspaceId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}

export function useToggleTaskCompletion(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { taskId: string; completed: boolean }) =>
      toggleTaskCompletionAction(data.taskId, data.completed, workspaceId),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", workspaceId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", workspaceId]);
      if (previous) {
        queryClient.setQueryData(
          ["tasks", workspaceId],
          previous.map((t) => (t.id === data.taskId ? { ...t, completed: data.completed, status: data.completed ? 'done' : 'todo' } : t))
        );
      }
      return { previous };
    },
    onError: (err, newTodo, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks", workspaceId], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] }),
  });
}

export function useMarkTaskViewed(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { taskId: string; userId: string }) =>
      markTaskViewedAction(data.taskId, data.userId, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] }),
  });
}

export function useMarkTaskReviewed(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { taskId: string; userId: string }) =>
      markTaskReviewedAction(data.taskId, data.userId, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] }),
  });
}

export function useAssignUser(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { task_id: string; user_id: string }) =>
      assignUserAction(data, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task_assignees", workspaceId] }),
  });
}

export function useUnassignUser(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { task_id: string; user_id: string }) =>
      unassignUserAction(data.task_id, data.user_id, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task_assignees", workspaceId] }),
  });
}
