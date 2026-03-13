import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { rowToTask, taskToInsertRow } from '@/utils/mappers'
import type { Task, TaskColor, TaskRow, TaskStatus, TaskUpdate } from '@/types'

const TODAY = new Date().toISOString().split('T')[0]

function tasksQueryKey(sessionId: string) {
  return ['tasks', sessionId, TODAY] as const
}

export function useTasks(sessionId: string) {
  return useQuery({
    queryKey: tasksQueryKey(sessionId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('session_id', sessionId)
        .eq('task_date', TODAY)
        .order('position', { ascending: true })

      if (error) throw error
      return ((data ?? []) as TaskRow[]).map(rowToTask)
    },
  })
}

export function useAddTask(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: { title: string; durationMin: number; color: TaskColor; position: number; icon?: string }) => {
      const row = taskToInsertRow({
        sessionId,
        title: values.title,
        durationMin: values.durationMin,
        color: values.color,
        icon: values.icon ?? '📋',
        position: values.position,
        status: 'pending',
        taskDate: TODAY,
      })
      const { data, error } = await supabase.from('tasks').insert(row).select().single()
      if (error) throw error
      return rowToTask(data as TaskRow)
    },
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(tasksQueryKey(sessionId), (old) => {
        const existing = old ?? []
        return existing.some((t) => t.id === newTask.id) ? existing : [...existing, newTask]
      })
      queryClient.invalidateQueries({ queryKey: tasksQueryKey(sessionId) })
    },
  })
}

export function useUpdateTask(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TaskUpdate) => {
      const dbUpdates: Record<string, unknown> = {}
      if (updates.title !== undefined) dbUpdates.title = updates.title
      if (updates.durationMin !== undefined) dbUpdates.duration_min = updates.durationMin
      if (updates.color !== undefined) dbUpdates.color = updates.color
      if (updates.icon !== undefined) dbUpdates.icon = updates.icon
      if (updates.position !== undefined) dbUpdates.position = updates.position
      if (updates.status !== undefined) dbUpdates.status = updates.status
      if (updates.spentSeconds !== undefined) dbUpdates.spent_seconds = updates.spentSeconds

      const { data, error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .eq('session_id', sessionId)
        .select()
        .single()
      if (error) throw error
      return rowToTask(data as TaskRow)
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey(sessionId) })
      const previous = queryClient.getQueryData<Task[]>(tasksQueryKey(sessionId))
      queryClient.setQueryData<Task[]>(tasksQueryKey(sessionId), (old) =>
        (old ?? []).map((t) => (t.id === updates.id ? { ...t, ...updates } : t)),
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(tasksQueryKey(sessionId), ctx.previous)
      }
    },
  })
}

export function useDeleteTask(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('session_id', sessionId)
      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey(sessionId) })
      const previous = queryClient.getQueryData<Task[]>(tasksQueryKey(sessionId))
      queryClient.setQueryData<Task[]>(tasksQueryKey(sessionId), (old) =>
        (old ?? []).filter((t) => t.id !== id),
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(tasksQueryKey(sessionId), ctx.previous)
      }
    },
  })
}

export function useClearCompleted(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('session_id', sessionId)
        .in('status', ['completed', 'skipped'])
      if (error) throw error
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey(sessionId) })
      const previous = queryClient.getQueryData<Task[]>(tasksQueryKey(sessionId))
      queryClient.setQueryData<Task[]>(tasksQueryKey(sessionId), (old) =>
        (old ?? []).filter((t) => t.status === 'pending'),
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(tasksQueryKey(sessionId), ctx.previous)
    },
  })
}

export function useClearAll(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('session_id', sessionId)
        .gte('position', 0)
      if (error) throw error
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey(sessionId) })
      const previous = queryClient.getQueryData<Task[]>(tasksQueryKey(sessionId))
      queryClient.setQueryData<Task[]>(tasksQueryKey(sessionId), [])
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(tasksQueryKey(sessionId), ctx.previous)
    },
  })
}
