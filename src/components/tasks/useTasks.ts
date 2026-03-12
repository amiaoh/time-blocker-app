import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { rowToTask, taskToInsertRow } from '@/utils/mappers'
import type { Task, TaskColor, TaskRow, TaskStatus } from '@/types'

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
    mutationFn: async (values: { title: string; durationMin: number; color: TaskColor; position: number }) => {
      const row = taskToInsertRow({
        sessionId,
        title: values.title,
        durationMin: values.durationMin,
        color: values.color,
        position: values.position,
        status: 'pending',
        taskDate: TODAY,
      })
      const { data, error } = await supabase.from('tasks').insert(row).select().single()
      if (error) throw error
      return rowToTask(data as TaskRow)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey(sessionId) }),
  })
}

export function useUpdateTask(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; title?: string; durationMin?: number; color?: TaskColor; position?: number; status?: TaskStatus }) => {
      const dbUpdates: Record<string, unknown> = {}
      if (updates.title !== undefined) dbUpdates.title = updates.title
      if (updates.durationMin !== undefined) dbUpdates.duration_min = updates.durationMin
      if (updates.color !== undefined) dbUpdates.color = updates.color
      if (updates.position !== undefined) dbUpdates.position = updates.position
      if (updates.status !== undefined) dbUpdates.status = updates.status

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
