import { useState, useEffect } from 'react'
import { useUserId } from '@/hooks/useUserId'
import { useTodoistApiKey } from '@/hooks/useTodoistApiKey'
import { useTodoistTasks } from '@/hooks/useTodoistTasks'
import { useLoadPreset, useAllPresetTaskMeta, usePresets, useSaveTasksToPreset, usePresetMembership } from '@/components/presets/usePresets'
import { useDragOrder } from '@/components/ordering/useDragOrder'
import { toaster } from '@/lib/toaster'
import { TOAST_DURATION_MS } from '@/constants'
import type { MappedTodoistTask } from '@/utils/todoistApi'
import type { PresetTask } from '@/types'

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function useTodoistPresetScreen(onLoadSuccess: () => void) {
  const userId = useUserId()
  const { apiKey, setApiKey } = useTodoistApiKey()
  const token = apiKey ?? undefined

  const { data: tasks, isLoading: isTasksLoading, error, refetch, isFetching } = useTodoistTasks(token)
  const loadPreset = useLoadPreset(userId)
  const saveTasksToPreset = useSaveTasksToPreset()
  const { data: presets = [] } = usePresets(userId)
  const { data: presetMetaMap = new Map<string, { durationMin: number; icon: string }>() } = useAllPresetTaskMeta(userId)
  const { data: membershipMap = new Map<string, string[]>() } = usePresetMembership(userId)

  const [orderedTasks, setOrderedTasks] = useState<MappedTodoistTask[]>([])
  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set())
  const [copyingTask, setCopyingTask] = useState<MappedTodoistTask | null>(null)

  useEffect(() => {
    if (tasks === undefined) return
    setOrderedTasks(tasks.map((t) => {
      const meta = presetMetaMap.get(t.title.toLowerCase())
      return meta !== undefined
        ? { ...t, durationMin: meta.durationMin, icon: meta.icon, durationFromPreset: true }
        : t
    }))
    setDeselectedIds(new Set())
  }, [tasks, presetMetaMap])

  const { activeId, handleDragStart, handleDragEnd, handleDragCancel } = useDragOrder({
    tasks: orderedTasks,
    onReorder: setOrderedTasks,
  })

  function isSelected(id: string) {
    return !deselectedIds.has(id)
  }

  function toggleSelect(id: string) {
    setDeselectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleDeleteTask(taskId: string) {
    setOrderedTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  function handleEditTitle(taskId: string, title: string) {
    setOrderedTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, title } : t))
  }

  function handleEditDuration(taskId: string, durationMin: number) {
    setOrderedTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, durationMin } : t))
  }

  function handleChangeIcon(taskId: string, icon: string) {
    setOrderedTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, icon } : t))
  }

  function handleCopyToPreset(presetId: string) {
    if (!copyingTask) return
    saveTasksToPreset.mutate(
      { presetId, tasks: [copyingTask] },
      {
        onSuccess: () => {
          setCopyingTask(null)
          toaster.create({ title: 'Task added to preset', type: 'success', duration: TOAST_DURATION_MS })
        },
        onError: (err) => toaster.create({ title: 'Failed to copy task', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleLoad(position: 'top' | 'bottom') {
    const selected = orderedTasks.filter((t) => !deselectedIds.has(t.id))
    if (selected.length === 0) {
      toaster.create({ title: 'No tasks selected', type: 'info', duration: TOAST_DURATION_MS })
      return
    }
    const presetTasks: PresetTask[] = selected.map((t, i) => ({
      ...t,
      presetId: 'todoist',
      position: i * 1000,
    }))
    loadPreset.mutate(
      { tasks: presetTasks, position },
      {
        onSuccess: () => {
          toaster.create({
            title: `${selected.length} task${selected.length === 1 ? '' : 's'} loaded`,
            type: 'success',
            duration: TOAST_DURATION_MS,
          })
          onLoadSuccess()
        },
        onError: (err) => toaster.create({ title: 'Failed to load tasks', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  return {
    token,
    setApiKey,
    orderedTasks,
    isTasksLoading,
    isFetching,
    error,
    refetch,
    isSelected,
    toggleSelect,
    handleLoad,
    isLoading: loadPreset.isPending,
    presets,
    copyingTask,
    setCopyingTask,
    handleCopyToPreset,
    isCopyingToPreset: saveTasksToPreset.isPending,
    membershipMap,
    handleDeleteTask,
    handleChangeIcon,
    handleEditTitle,
    handleEditDuration,
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
