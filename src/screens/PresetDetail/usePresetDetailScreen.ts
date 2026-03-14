import { useState } from 'react'
import { useSessionId } from '@/hooks/useSessionId'
import {
  usePresetTasks,
  useAddPresetTask,
  useDeletePresetTask,
  useDuplicatePresetTask,
  useUpdatePresetTask,
  useLoadPreset,
} from '@/components/presets/usePresets'
import { useDragOrder } from '@/components/ordering/useDragOrder'
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { toaster } from '@/lib/toaster'
import { TOAST_DURATION_MS } from '@/constants'
import type { PresetTask, TaskFormValues } from '@/types'

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function usePresetDetailScreen(presetId: string, onLoadSuccess: () => void) {
  const sessionId = useSessionId()
  const { data: tasks = [], isLoading: isTasksLoading } = usePresetTasks(presetId)
  const addTask = useAddPresetTask(presetId)
  const updateTask = useUpdatePresetTask(presetId)
  const deleteTask = useDeletePresetTask(presetId)
  const duplicateTask = useDuplicatePresetTask(presetId)
  const loadPreset = useLoadPreset(sessionId)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 10 } }),
  )

  const { handleDragStart, handleDragEnd, handleDragCancel } = useDragOrder({
    tasks,
    onReorder: (reordered) => {
      reordered.forEach((task) => {
        const orig = tasks.find((t) => t.id === task.id)
        if (orig && orig.position !== task.position) {
          updateTask.mutate({ id: task.id, position: task.position })
        }
      })
    },
  })

  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set())
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  function isSelected(id: string): boolean {
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

  function handleDelete(taskId: string) {
    deleteTask.mutate(taskId, {
      onError: (err) => toaster.create({ title: 'Failed to delete task', description: errorMessage(err), type: 'error' }),
    })
  }

  function handleDuplicate(task: PresetTask) {
    duplicateTask.mutate(task, {
      onError: (err) => toaster.create({ title: 'Failed to duplicate task', description: errorMessage(err), type: 'error' }),
    })
  }

  function handleAddTask(values: TaskFormValues) {
    addTask.mutate(
      { title: values.title, durationMin: values.durationMin, color: values.color, icon: '📋' },
      {
        onSuccess: () => {
          setIsAddTaskOpen(false)
          toaster.create({ title: 'Task added to preset', type: 'success', duration: TOAST_DURATION_MS })
        },
        onError: (err) => toaster.create({ title: 'Failed to add task', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleLoad(position: 'top' | 'bottom') {
    const selectedTasks = tasks.filter((t) => !deselectedIds.has(t.id))
    if (selectedTasks.length === 0) {
      toaster.create({ title: 'No tasks selected', type: 'info', duration: TOAST_DURATION_MS })
      return
    }
    loadPreset.mutate(
      { tasks: selectedTasks, position },
      {
        onSuccess: () => {
          toaster.create({
            title: `${selectedTasks.length} task${selectedTasks.length === 1 ? '' : 's'} loaded`,
            type: 'success',
            duration: TOAST_DURATION_MS,
          })
          onLoadSuccess()
        },
        onError: (err) => toaster.create({ title: 'Failed to load preset', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  return {
    tasks,
    isTasksLoading,
    isSelected,
    toggleSelect,
    handleDelete,
    handleDuplicate,
    handleAddTask,
    handleLoad,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isAddingTask: addTask.isPending,
    isLoading: loadPreset.isPending,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
