import { useCallback, useRef, useState } from 'react'
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useTimer } from '@/components/timer/useTimer'
import { useDragOrder } from '@/components/ordering/useDragOrder'
import { useProjection } from '@/components/projection/useProjection'
import { useTasks, useAddTask, useUpdateTask, useDeleteTask, useClearCompleted, useClearAll } from '@/components/tasks/useTasks'
import { useSessionId } from '@/hooks/useSessionId'
import { toaster } from '@/lib/toaster'
import type { Task, TaskFormValues } from '@/types'

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'object' && err !== null && 'message' in err) return String((err as { message: unknown }).message)
  return 'Something went wrong'
}

export function useTimerScreen() {
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

  // Refs to break the timer ↔ task circular dependency without stale closures
  const tasksRef = useRef<Task[]>([])
  tasksRef.current = tasks
  const startRef = useRef<((task: Task) => void) | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  const autoStartNext = useCallback((completedId: string) => {
    const next = tasksRef.current.find((t) => t.status === 'pending' && t.id !== completedId)
    if (next && startRef.current) startRef.current(next)
  }, [])

  const handleComplete = useCallback(
    (taskId: string) => {
      updateTask.mutate(
        { id: taskId, status: 'completed' },
        {
          onSuccess: () => {
            toaster.create({ title: 'Task completed! 🎉', type: 'success', duration: 2000 })
            autoStartNext(taskId)
          },
          onError: (err) => toaster.create({ title: 'Failed to complete task', description: errorMessage(err), type: 'error' }),
        },
      )
    },
    [updateTask, autoStartNext],
  )

  const handleSkip = useCallback(
    (taskId: string) => {
      updateTask.mutate(
        { id: taskId, status: 'skipped' },
        {
          onSuccess: () => {
            toaster.create({ title: 'Task skipped', type: 'info', duration: 2000 })
            autoStartNext(taskId)
          },
          onError: (err) => toaster.create({ title: 'Failed to skip task', description: errorMessage(err), type: 'error' }),
        },
      )
    },
    [updateTask, autoStartNext],
  )

  const { timerState, start, pause, resume, complete, skip } = useTimer({
    onComplete: handleComplete,
    onSkip: handleSkip,
  })

  // Must be set after useTimer so startRef always holds the latest start fn
  startRef.current = start

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

  const projection = useProjection(tasks, timerState)
  const activeTask = tasks.find((t) => t.id === timerState.activeTaskId)

  function handleAddSubmit(values: TaskFormValues) {
    const maxPosition = tasks.length > 0 ? Math.max(...tasks.map((t) => t.position)) : 0
    addTask.mutate(
      { ...values, position: maxPosition + 1000 },
      {
        onSuccess: () => {
          setIsFormOpen(false)
          toaster.create({ title: 'Task added', type: 'success', duration: 2000 })
        },
        onError: (err) => toaster.create({ title: 'Failed to add task', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleEditSubmit(values: TaskFormValues) {
    if (!editingTask) return
    updateTask.mutate(
      { id: editingTask.id, ...values },
      {
        onSuccess: () => {
          setEditingTask(undefined)
          toaster.create({ title: 'Task updated', type: 'success', duration: 2000 })
        },
        onError: (err) => toaster.create({ title: 'Failed to update task', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleDeleteConfirm() {
    if (!deletingTask) return
    deleteTask.mutate(deletingTask.id, {
      onSuccess: () => {
        setDeletingTask(undefined)
        toaster.create({ title: 'Task deleted', type: 'info', duration: 2000 })
      },
      onError: (err) => toaster.create({ title: 'Failed to delete task', description: errorMessage(err), type: 'error' }),
    })
  }

  function handleReset(task: Task) {
    updateTask.mutate(
      { id: task.id, status: 'pending' },
      {
        onSuccess: () => toaster.create({ title: 'Task reset', type: 'info', duration: 2000 }),
        onError: (err) => toaster.create({ title: 'Failed to reset task', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleAdjustDuration(task: Task, deltaMin: number) {
    const newDuration = Math.min(480, Math.max(5, task.durationMin + deltaMin))
    updateTask.mutate(
      { id: task.id, durationMin: newDuration },
      {
        onError: (err) => toaster.create({ title: 'Failed to update duration', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  function handleClearCompleted() {
    clearCompleted.mutate(undefined, {
      onSuccess: () => toaster.create({ title: 'Completed tasks cleared 🎉', type: 'info', duration: 2000 }),
      onError: (err) => toaster.create({ title: 'Failed to clear tasks', description: errorMessage(err), type: 'error' }),
    })
  }

  function handleChangeIcon(task: Task, icon: string) {
    updateTask.mutate({ id: task.id, icon })
  }

  function handleClearAll() {
    clearAll.mutate(undefined, {
      onSuccess: () => toaster.create({ title: 'All tasks cleared 🧹', type: 'info', duration: 2000 }),
      onError: (err) => toaster.create({ title: 'Failed to clear tasks', description: errorMessage(err), type: 'error' }),
    })
  }

  function handleTimerToggle() {
    if (!activeTask) return
    if (timerState.isRunning) pause()
    else if (timerState.isPaused) resume()
    else start(activeTask)
  }

  return {
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
    start,
    pause,
    resume,
    complete,
    skip,
    handleTimerToggle,
    // Task handlers
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    handleReset,
    handleAdjustDuration,
    handleChangeIcon,
    handleClearCompleted,
    handleClearAll,
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
