import { useMemo, useState } from 'react'
import { useUserId } from '@/hooks/useUserId'
import {
  usePresetTasks,
  useAddPresetTask,
  useDeletePresetTask,
  useDuplicatePresetTask,
  useUpdatePresetTask,
  useUpdatePreset,
  useLoadPreset,
  usePresets,
  usePresetMembership,
  useSaveTasksToPreset,
} from '@/components/presets/usePresets'
import { useDragOrder } from '@/components/ordering/useDragOrder'
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { toaster } from '@/lib/toaster'
import { TOAST_DURATION_MS } from '@/constants'
import type { PresetList, PresetTask, TaskFormValues, TaskColor } from '@/types'
import { TASK_COLORS } from '@/types'

const PRIORITY_ORDER = new Map(TASK_COLORS.map((c, i) => [c, i]))

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function usePresetDetailScreen(
  presetId: string,
  onLoadSuccess: () => void,
  onRename: (updated: PresetList) => void,
) {
  const userId = useUserId()
  const { data: rawTasks = [], isLoading: isTasksLoading } = usePresetTasks(presetId)
  const tasks = useMemo(
    () => [...rawTasks].sort((a, b) => {
      const pa = PRIORITY_ORDER.get(a.color) ?? 99
      const pb = PRIORITY_ORDER.get(b.color) ?? 99
      return pa !== pb ? pa - pb : a.position - b.position
    }),
    [rawTasks],
  )
  const addTask = useAddPresetTask(presetId)
  const updateTask = useUpdatePresetTask(presetId)
  const deleteTask = useDeletePresetTask(presetId)
  const duplicateTask = useDuplicatePresetTask(presetId)
  const updatePreset = useUpdatePreset(userId)
  const loadPreset = useLoadPreset(userId)
  const { data: presets = [] } = usePresets(userId)
  const { data: membershipMap = new Map<string, string[]>() } = usePresetMembership(userId)
  const saveTasksToPreset = useSaveTasksToPreset()

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

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [copyingTask, setCopyingTask] = useState<PresetTask | null>(null)

  function isSelected(id: string): boolean {
    return selectedIds.has(id)
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleChangeIcon(taskId: string, icon: string) {
    updateTask.mutate(
      { id: taskId, icon },
      { onError: (err) => toaster.create({ title: 'Failed to update icon', description: errorMessage(err), type: 'error' }) },
    )
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

  function handleEditTitle(taskId: string, title: string) {
    updateTask.mutate({ id: taskId, title })
  }

  function handleEditDuration(taskId: string, durationMin: number) {
    updateTask.mutate({ id: taskId, durationMin })
  }

  function handleCopyToPreset(targetPresetId: string) {
    if (!copyingTask) return
    saveTasksToPreset.mutate(
      {
        presetId: targetPresetId,
        tasks: [{ title: copyingTask.title, durationMin: copyingTask.durationMin, color: copyingTask.color as TaskColor as string, icon: copyingTask.icon }],
      },
      {
        onSuccess: () => {
          setCopyingTask(null)
          toaster.create({ title: 'Task copied to preset', type: 'success', duration: TOAST_DURATION_MS })
        },
        onError: (err) => toaster.create({ title: 'Failed to copy task', description: errorMessage(err), type: 'error' }),
      },
    )
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

  function handleRenameSubmit({ name, icon }: { name: string; icon: string }) {
    updatePreset.mutate(
      { id: presetId, name, icon },
      {
        onSuccess: (updated) => {
          setIsRenameOpen(false)
          toaster.create({ title: 'Preset renamed', type: 'success', duration: TOAST_DURATION_MS })
          onRename(updated)
        },
        onError: (err) => toaster.create({ title: 'Failed to rename preset', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleLoad(position: 'top' | 'bottom') {
    const selectedTasks = tasks.filter((t) => selectedIds.has(t.id))
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
    handleChangeIcon,
    handleDelete,
    handleDuplicate,
    handleAddTask,
    handleLoad,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isAddingTask: addTask.isPending,
    handleEditTitle,
    handleEditDuration,
    presets,
    membershipMap,
    copyingTask,
    setCopyingTask,
    handleCopyToPreset,
    isCopyingToPreset: saveTasksToPreset.isPending,
    isLoading: loadPreset.isPending,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    isRenameOpen,
    setIsRenameOpen,
    handleRenameSubmit,
    isRenamingPreset: updatePreset.isPending,
  }
}
