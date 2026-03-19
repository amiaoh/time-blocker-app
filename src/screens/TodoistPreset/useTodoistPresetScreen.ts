import { useState, useEffect } from 'react'
import { useUserId } from '@/hooks/useUserId'
import { useTodoistApiKey } from '@/hooks/useTodoistApiKey'
import { useTodoistTasks } from '@/hooks/useTodoistTasks'
import { useLoadPreset, useAllPresetTaskDurations, usePresets, useSaveTasksToPreset } from '@/components/presets/usePresets'
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
  const { data: durationMap = new Map<string, number>() } = useAllPresetTaskDurations(userId)


  const [orderedTasks, setOrderedTasks] = useState<MappedTodoistTask[]>([])
  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set())
  const [copyingTask, setCopyingTask] = useState<MappedTodoistTask | null>(null)

  useEffect(() => {
    if (tasks === undefined) return
    setOrderedTasks(tasks.map((t) => {
      const presetDuration = durationMap.get(t.title.toLowerCase())
      return presetDuration !== undefined
        ? { ...t, durationMin: presetDuration, durationFromPreset: true }
        : t
    }))
    setDeselectedIds(new Set())
  }, [tasks, durationMap])

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
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
