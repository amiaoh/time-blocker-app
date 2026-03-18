import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { rowToPresetList, rowToPresetTask } from '@/utils/mappers'
import type { PresetListRow, PresetTask, PresetTaskRow, TaskColor } from '@/types'

const TODAY = new Date().toISOString().split('T')[0]

function presetsQueryKey(userId: string) {
  return ['presets', userId] as const
}

export function presetTasksQueryKey(presetId: string) {
  return ['preset-tasks', presetId] as const
}

// Returns a Map<title_lowercase, durationMin> across all presets for the session.
// Used to auto-apply user-defined durations when importing from Todoist.
export function useAllPresetTaskDurations(userId: string) {
  return useQuery({
    queryKey: ['all-preset-task-durations', userId],
    queryFn: async () => {
      const { data: presets } = await supabase
        .from('preset_lists')
        .select('id')
        .eq('user_id', userId)
      const presetIds = (presets as { id: string }[] | null)?.map((p) => p.id) ?? []
      if (presetIds.length === 0) return new Map<string, number>()
      const { data, error } = await supabase
        .from('preset_tasks')
        .select('title, duration_min')
        .in('preset_id', presetIds)
      if (error) throw error
      const map = new Map<string, number>()
      for (const row of (data ?? []) as { title: string; duration_min: number }[]) {
        map.set(row.title.toLowerCase(), row.duration_min)
      }
      return map
    },
  })
}

export function usePresets(userId: string) {
  return useQuery({
    queryKey: presetsQueryKey(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preset_lists')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true })
      if (error) throw error
      return ((data ?? []) as PresetListRow[]).map(rowToPresetList)
    },
  })
}

export function usePresetTasks(presetId: string) {
  return useQuery({
    queryKey: presetTasksQueryKey(presetId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preset_tasks')
        .select('*')
        .eq('preset_id', presetId)
        .order('position', { ascending: true })
      if (error) throw error
      return ((data ?? []) as PresetTaskRow[]).map(rowToPresetTask)
    },
  })
}

export function useAddPreset(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, icon }: { name: string; icon: string }) => {
      const { data: existing } = await supabase
        .from('preset_lists')
        .select('position')
        .eq('user_id', userId)
        .order('position', { ascending: false })
        .limit(1)
      const maxPosition = (existing as { position: number }[] | null)?.[0]?.position ?? 0
      const { data, error } = await supabase
        .from('preset_lists')
        .insert({ user_id: userId, name, icon, position: maxPosition + 1000 })
        .select()
        .single()
      if (error) throw error
      return rowToPresetList(data as PresetListRow)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: presetsQueryKey(userId) }),
  })
}

export function useUpdatePreset(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, name, icon }: { id: string; name?: string; icon?: string }) => {
      const updates: Record<string, unknown> = {}
      if (name !== undefined) updates.name = name
      if (icon !== undefined) updates.icon = icon
      const { data, error } = await supabase
        .from('preset_lists')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return rowToPresetList(data as PresetListRow)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: presetsQueryKey(userId) }),
  })
}

export function useDeletePreset(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (presetId: string) => {
      const { error } = await supabase
        .from('preset_lists')
        .delete()
        .eq('id', presetId)
        .eq('user_id', userId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: presetsQueryKey(userId) }),
  })
}

export function useAddPresetTask(presetId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: { title: string; durationMin: number; color: TaskColor; icon: string }) => {
      const { data: existing } = await supabase
        .from('preset_tasks')
        .select('position')
        .eq('preset_id', presetId)
        .order('position', { ascending: false })
        .limit(1)
      const maxPosition = (existing as { position: number }[] | null)?.[0]?.position ?? 0
      const { data, error } = await supabase
        .from('preset_tasks')
        .insert({ preset_id: presetId, title: task.title, duration_min: task.durationMin, color: task.color, icon: task.icon, position: maxPosition + 1000 })
        .select()
        .single()
      if (error) throw error
      return rowToPresetTask(data as PresetTaskRow)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: presetTasksQueryKey(presetId) }),
  })
}

type PresetTaskUpdate = { id: string } & Partial<Pick<PresetTask, 'title' | 'durationMin' | 'color' | 'icon' | 'position'>>

export function useUpdatePresetTask(presetId: string) {
  const queryClient = useQueryClient()
  const qk = presetTasksQueryKey(presetId)
  return useMutation({
    mutationFn: async ({ id, title, durationMin, color, icon, position }: PresetTaskUpdate) => {
      const update: Record<string, unknown> = {}
      if (title !== undefined) update.title = title
      if (durationMin !== undefined) update.duration_min = durationMin
      if (color !== undefined) update.color = color
      if (icon !== undefined) update.icon = icon
      if (position !== undefined) update.position = position
      const { error } = await supabase.from('preset_tasks').update(update).eq('id', id)
      if (error) throw error
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: qk })
      const previous = queryClient.getQueryData<PresetTask[]>(qk)
      queryClient.setQueryData<PresetTask[]>(qk, (old) =>
        old?.map((t) => t.id === vars.id ? { ...t, ...vars } : t) ?? []
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(qk, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  })
}

export function useDeletePresetTask(presetId: string) {
  const queryClient = useQueryClient()
  const qk = presetTasksQueryKey(presetId)
  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from('preset_tasks').delete().eq('id', taskId)
      if (error) throw error
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: qk })
      const previous = queryClient.getQueryData<PresetTask[]>(qk)
      queryClient.setQueryData<PresetTask[]>(qk, (old) => old?.filter((t) => t.id !== taskId) ?? [])
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(qk, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  })
}

export function useDuplicatePresetTask(presetId: string) {
  const queryClient = useQueryClient()
  const qk = presetTasksQueryKey(presetId)
  return useMutation({
    mutationFn: async (task: PresetTask) => {
      const { data, error } = await supabase
        .from('preset_tasks')
        .insert({ preset_id: presetId, title: task.title, duration_min: task.durationMin, color: task.color, icon: task.icon, position: task.position + 500 })
        .select()
        .single()
      if (error) throw error
      return rowToPresetTask(data as PresetTaskRow)
    },
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: qk })
      const previous = queryClient.getQueryData<PresetTask[]>(qk)
      const optimistic: PresetTask = { ...task, id: `temp-${Date.now()}`, position: task.position + 500 }
      queryClient.setQueryData<PresetTask[]>(qk, (old) => old ? [...old, optimistic] : [optimistic])
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(qk, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  })
}

export function useLoadPreset(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ tasks, position }: { tasks: PresetTask[]; position: 'top' | 'bottom' }) => {
      const { data: existing } = await supabase
        .from('tasks')
        .select('position')
        .eq('user_id', userId)
        .eq('task_date', TODAY)
        .order('position', { ascending: position === 'top' })
        .limit(1)
      const refPosition = (existing as { position: number }[] | null)?.[0]?.position ?? 1000
      const rows = tasks.map((task, i) => ({
        user_id: userId,
        title: task.title,
        duration_min: task.durationMin,
        color: task.color,
        icon: task.icon,
        position: position === 'top'
          ? refPosition - (tasks.length - i) * 1000
          : refPosition + (i + 1) * 1000,
        status: 'pending',
        task_date: TODAY,
      }))
      const { error } = await supabase.from('tasks').insert(rows)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', userId] }),
  })
}
