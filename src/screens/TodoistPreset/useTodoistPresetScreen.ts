import { useState, useEffect } from 'react'
import { useSessionId } from '@/hooks/useSessionId'
import { useSettings } from '@/hooks/useSettings'
import { useTodoistTasks } from '@/hooks/useTodoistTasks'
import { useLoadPreset } from '@/components/presets/usePresets'
import { useDragOrder } from '@/components/ordering/useDragOrder'
import { toaster } from '@/lib/toaster'
import { TOAST_DURATION_MS } from '@/constants'
import type { MappedTodoistTask } from '@/utils/todoistApi'
import type { PresetTask } from '@/types'

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function useTodoistPresetScreen(onLoadSuccess: () => void) {
  const sessionId = useSessionId()
  const { settings } = useSettings()
  const token = settings.todoistToken || undefined

  const { data: tasks, isLoading: isTasksLoading, error, refetch, isFetching } = useTodoistTasks(token)
  const loadPreset = useLoadPreset(sessionId)

  const [orderedTasks, setOrderedTasks] = useState<MappedTodoistTask[]>([])
  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set())

  // Sync ordered tasks when fresh data arrives (e.g. initial load or refresh)
  useEffect(() => {
    if (tasks === undefined) return
    setOrderedTasks(tasks)
    setDeselectedIds(new Set())
  }, [tasks])

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
    orderedTasks,
    isTasksLoading,
    isFetching,
    error,
    refetch,
    isSelected,
    toggleSelect,
    handleLoad,
    isLoading: loadPreset.isPending,
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
