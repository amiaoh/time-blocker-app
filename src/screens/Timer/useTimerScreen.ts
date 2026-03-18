import { useCallback, useEffect, useMemo, useState } from 'react'
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useTimer } from '@/components/timer/useTimer'
import { useTimerNotifications } from '@/components/timer/useTimerNotifications'
import { requestNotificationPermission } from '@/utils/notifications'
import { useDragOrder } from '@/components/ordering/useDragOrder'
import { useProjection } from '@/components/projection/useProjection'
import { useTasks, useAddTask, useUpdateTask, useDeleteTask, useClearCompleted, useClearAll } from '@/components/tasks/useTasks'
import { useSessionId } from '@/hooks/useSessionId'
import { useSettings } from '@/hooks/useSettings'
import { toaster } from '@/lib/toaster'
import type { Task, TaskFormValues } from '@/types'
import { TOAST_DURATION_MS, MIN_TASK_DURATION_MIN } from '@/constants'

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'object' && err !== null && 'message' in err) return String((err as { message: unknown }).message)
  return 'Something went wrong'
}

export function useTimerScreen() {
  const { settings, updateSettings } = useSettings()
  const sessionId = useSessionId()
  const { data: tasks = [], isLoading, error: loadError } = useTasks(sessionId)
  const addTask = useAddTask(sessionId)
  const updateTask = useUpdateTask(sessionId)
  const deleteTask = useDeleteTask(sessionId)
  const clearCompleted = useClearCompleted(sessionId)
  const clearAll = useClearAll(sessionId)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
  const [deletingTask, setDeletingTask] = useState<Task | undefined>(undefined)
  const [hideCompleted, setHideCompleted] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 10 } }),
  )

  const handleComplete = useCallback(
    (taskId: string, elapsedSeconds: number) => {
      updateTask.mutate(
        { id: taskId, status: 'completed', spentSeconds: elapsedSeconds },
        {
          onSuccess: () => toaster.create({ title: 'Task completed! 🎉', type: 'success', duration: TOAST_DURATION_MS }),
          onError: (err) => toaster.create({ title: 'Failed to complete task', description: errorMessage(err), type: 'error' }),
        },
      )
    },
    [updateTask],
  )

  const handleSkip = useCallback(
    (taskId: string) => {
      updateTask.mutate(
        { id: taskId, status: 'skipped' },
        {
          onSuccess: () => toaster.create({ title: 'Task skipped', type: 'info', duration: TOAST_DURATION_MS }),
          onError: (err) => toaster.create({ title: 'Failed to skip task', description: errorMessage(err), type: 'error' }),
        },
      )
    },
    [updateTask],
  )

  const { timerState, taskElapsed, taskRemaining, select, start, pause, resume, complete, skip, clearTaskTimer, clearTaskRemaining, adjustRemaining } = useTimer({
    onComplete: handleComplete,
    onSkip: handleSkip,
  })

  // Auto-select the first pending task when tasks load and nothing is active
  useEffect(() => {
    if (timerState.activeTaskId !== null) return
    const firstPending = tasks.find((t) => t.status === 'pending')
    if (firstPending) select(firstPending)
  }, [tasks, timerState.activeTaskId, select])

  const { handleDragStart, handleDragEnd, handleDragCancel } = useDragOrder({
    tasks,
    onReorder: (reordered) => {
      reordered.forEach((task) => {
        const orig = tasks.find((t) => t.id === task.id)
        if (orig && orig.position !== task.position) {
          updateTask.mutate({ id: task.id, position: task.position })
        }
      })
      // After reorder, if the timer is idle re-select the new top pending task
      if (!timerState.isRunning && !timerState.isPaused) {
        const newTop = reordered.find((t) => t.status === 'pending')
        if (newTop && newTop.id !== timerState.activeTaskId) {
          select(newTop)
        }
      }
    },
  })

  const projection = useProjection(tasks, timerState)
  const activeTask = tasks.find((t) => t.id === timerState.activeTaskId) ?? null

  useTimerNotifications(timerState, activeTask)

  const taskTimeRanges = useMemo(() => {
    const pending = tasks
      .filter((t) => t.status === 'pending')
      .sort((a, b) => a.position - b.position)
    const result = new Map<string, { start: Date; end: Date }>()
    let cursor = new Date()
    for (const task of pending) {
      const durationMs = task.id === timerState.activeTaskId
        ? timerState.remainingSeconds * 1000
        : task.durationMin * 60 * 1000
      const start = new Date(cursor)
      const end = new Date(cursor.getTime() + durationMs)
      result.set(task.id, { start, end })
      cursor = end
    }
    return result
  }, [tasks, timerState.activeTaskId, timerState.remainingSeconds])

  function handleAddSubmit(values: TaskFormValues) {
    const maxPosition = tasks.length > 0 ? Math.max(...tasks.map((t) => t.position)) : 0
    addTask.mutate(
      { ...values, position: maxPosition + 1000 },
      {
        onSuccess: (newTask) => {
          setIsFormOpen(false)
          toaster.create({ title: 'Task added', type: 'success', duration: TOAST_DURATION_MS })
          if (timerState.activeTaskId === null) select(newTask)
        },
        onError: (err) => toaster.create({ title: 'Failed to add task', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleEditSubmit(values: TaskFormValues) {
    if (!editingTask) return
    const id = editingTask.id
    setEditingTask(undefined)
    updateTask.mutate(
      { id, ...values },
      {
        onSuccess: () => {
          toaster.create({ title: 'Task updated', type: 'success', duration: TOAST_DURATION_MS })
          clearTaskRemaining(id)
        },
        onError: (err) => toaster.create({ title: 'Failed to update task', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleCompleteTask(task: Task) {
    if (task.id === timerState.activeTaskId) {
      complete()
    } else {
      const elapsedSeconds = taskElapsed.get(task.id) ?? 0
      updateTask.mutate(
        { id: task.id, status: 'completed', spentSeconds: elapsedSeconds },
        {
          onSuccess: () => toaster.create({ title: 'Task completed! 🎉', type: 'success', duration: TOAST_DURATION_MS }),
          onError: (err) => toaster.create({ title: 'Failed to complete task', description: errorMessage(err), type: 'error' }),
        },
      )
    }
  }

  function handleDeleteConfirm() {
    if (!deletingTask) return
    deleteTask.mutate(deletingTask.id, {
      onSuccess: () => {
        setDeletingTask(undefined)
        toaster.create({ title: 'Task deleted', type: 'info', duration: TOAST_DURATION_MS })
      },
      onError: (err) => toaster.create({ title: 'Failed to delete task', description: errorMessage(err), type: 'error' }),
    })
  }

  function handleReset(task: Task) {
    clearTaskTimer(task.id)
    updateTask.mutate(
      { id: task.id, status: 'pending', spentSeconds: 0, originalDurationMin: undefined },
      {
        onSuccess: () => toaster.create({ title: 'Task reset', type: 'info', duration: TOAST_DURATION_MS }),
        onError: (err) => toaster.create({ title: 'Failed to reset task', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleAdjustDuration(task: Task, deltaMin: number) {
    const newDuration = Math.min(settings.maxTaskDurationMin, Math.max(MIN_TASK_DURATION_MIN, task.durationMin + deltaMin))
    const actualDelta = newDuration - task.durationMin

    if (deltaMin > 0 && newDuration === settings.maxTaskDurationMin) {
      toaster.create({ title: 'Maximum task time reached!', type: 'info', duration: TOAST_DURATION_MS })
    } else if (deltaMin < 0 && newDuration === MIN_TASK_DURATION_MIN) {
      toaster.create({ title: "Can't decrease the time!", type: 'info', duration: TOAST_DURATION_MS })
    }

    if (actualDelta === 0) return

    updateTask.mutate(
      { id: task.id, durationMin: newDuration },
      {
        onError: (err) => toaster.create({ title: 'Failed to update duration', description: errorMessage(err), type: 'error' }),
      },
    )
    if (task.id === timerState.activeTaskId) {
      adjustRemaining(actualDelta)
    }
  }

  function handleClearCompleted() {
    clearCompleted.mutate(undefined, {
      onSuccess: () => toaster.create({ title: 'Completed tasks cleared 🎉', type: 'info', duration: TOAST_DURATION_MS }),
      onError: (err) => toaster.create({ title: 'Failed to clear tasks', description: errorMessage(err), type: 'error' }),
    })
  }

  function handleMoveToTop(task: Task) {
    const pendingTasks = tasks.filter((t) => t.status === 'pending')
    const minPosition = pendingTasks.length > 0 ? Math.min(...pendingTasks.map((t) => t.position)) : 1000
    updateTask.mutate(
      { id: task.id, position: minPosition - 1000 },
      { onError: (err) => toaster.create({ title: 'Failed to move task', description: errorMessage(err), type: 'error' }) },
    )
    select(task)
  }

  function handleChangeIcon(task: Task, icon: string) {
    updateTask.mutate({ id: task.id, icon })
  }

  function handleClearAll() {
    clearAll.mutate(undefined, {
      onSuccess: () => toaster.create({ title: 'All tasks cleared 🧹', type: 'info', duration: TOAST_DURATION_MS }),
      onError: (err) => toaster.create({ title: 'Failed to clear tasks', description: errorMessage(err), type: 'error' }),
    })
  }

  function handleTimerToggle() {
    if (!activeTask) return
    if (timerState.isRunning) pause()
    else if (timerState.isPaused) resume()
    else {
      if (activeTask.originalDurationMin === undefined) {
        updateTask.mutate({ id: activeTask.id, originalDurationMin: activeTask.durationMin })
      }
      requestNotificationPermission()
      start(activeTask)
    }
  }

  return {
    // Settings
    settings,
    updateSettings,
    // Data
    tasks,
    isLoading,
    loadError,
    activeTask,
    projection,
    // UI state
    isFormOpen,
    editingTask,
    deletingTask,
    hideCompleted,
    setIsFormOpen,
    setEditingTask,
    setDeletingTask,
    setHideCompleted,
    // Timer
    timerState,
    taskElapsed,
    taskRemaining,
    select,
    start,
    pause,
    resume,
    skip,
    handleCompleteTask,
    handleTimerToggle,
    // Task handlers
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    handleReset,
    handleAdjustDuration,
    handleMoveToTop,
    handleChangeIcon,
    handleClearCompleted,
    handleClearAll,
    taskTimeRanges,
    // Drag
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    // Mutation pending states
    isAddingTask: addTask.isPending,
    isUpdatingTask: updateTask.isPending,
    isDeletingTask: deleteTask.isPending,
  }
}
