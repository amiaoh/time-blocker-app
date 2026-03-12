import { useCallback, useRef, useState } from 'react'
import { Box, HStack, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { DaySummary } from '@/components/projection/DaySummary'
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

export function TimerScreen() {
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

  // Refs to avoid stale closures in timer callbacks
  const tasksRef = useRef<Task[]>([])
  tasksRef.current = tasks
  const startRef = useRef<((task: Task) => void) | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  const autoStartNext = useCallback((completedId: string) => {
    const next = tasksRef.current.find(
      (t) => t.status === 'pending' && t.id !== completedId,
    )
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

  // Keep startRef current after useTimer initialises
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

  function handleClearAll() {
    clearAll.mutate(undefined, {
      onSuccess: () => {
        toaster.create({ title: 'All tasks cleared 🧹', type: 'info', duration: 2000 })
      },
      onError: (err) => toaster.create({ title: 'Failed to clear tasks', description: errorMessage(err), type: 'error' }),
    })
  }

  function handleTimerToggle() {
    if (!activeTask) return
    if (timerState.isRunning) pause()
    else if (timerState.isPaused) resume()
    else start(activeTask)
  }

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <Box minH="100vh" bg="gray.950" pb={8}>
      <Box maxW="560px" mx="auto" px={4} pt={8}>
        {/* Header */}
        <HStack justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="white">Today</Heading>
            <Text color="gray.500" fontSize="sm">{today}</Text>
          </Box>
        </HStack>

        {/* Timer — always visible */}
        <Box mb={6} textAlign="center">
          {activeTask && (
            <Text color="gray.400" fontSize="sm" mb={1}>
              Now focusing on
            </Text>
          )}
          <Text
            color={activeTask ? 'white' : 'gray.600'}
            fontWeight={activeTask ? 'semibold' : 'normal'}
            fontSize="lg"
            mb={4}
            minH={7}
          >
            {activeTask ? activeTask.title : 'No task running'}
          </Text>

          <TimerDisplay
            remainingSeconds={timerState.remainingSeconds}
            durationMin={activeTask?.durationMin ?? 0}
            color={activeTask?.color ?? '#4A5568'}
            isRunning={timerState.isRunning}
            isIdle={!activeTask}
            onToggle={activeTask ? handleTimerToggle : undefined}
          />

          {activeTask && (
            <Stack align="center" gap={4} mt={4}>
              <HStack gap={3}>
                <Text
                  as="button"
                  fontSize="sm"
                  color="gray.500"
                  _hover={{ color: 'gray.300' }}
                  cursor="pointer"
                  bg="transparent"
                  border="none"
                  p={0}
                  onClick={() => handleAdjustDuration(activeTask, -5)}
                >
                  −5m
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {activeTask.durationMin}m
                </Text>
                <Text
                  as="button"
                  fontSize="sm"
                  color="gray.500"
                  _hover={{ color: 'gray.300' }}
                  cursor="pointer"
                  bg="transparent"
                  border="none"
                  p={0}
                  onClick={() => handleAdjustDuration(activeTask, 5)}
                >
                  +5m
                </Text>
              </HStack>
              <TimerControls
                isRunning={timerState.isRunning}
                isPaused={timerState.isPaused}
                onPause={pause}
                onResume={resume}
                onComplete={complete}
                onSkip={skip}
                accentColor={activeTask.color}
              />
            </Stack>
          )}
        </Box>

        {/* Load error */}
        {loadError && (
          <Box bg="red.900" borderRadius="lg" p={4} mb={4}>
            <Text color="red.200" fontSize="sm" fontWeight="semibold">Failed to load tasks</Text>
            <Text color="red.300" fontSize="xs" mt={1}>{errorMessage(loadError)}</Text>
          </Box>
        )}

        {/* Day summary + task list */}
        {isLoading ? (
          <Box textAlign="center" py={12}>
            <Spinner color="brand.400" />
          </Box>
        ) : (
          <>
            {tasks.length > 0 && <DaySummary projection={projection} />}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <TaskList
                tasks={tasks}
                timerState={timerState}
                hideCompleted={hideCompleted}
                onToggleHideCompleted={() => setHideCompleted((v) => !v)}
                onAddTask={() => setIsFormOpen(true)}
                onClearCompleted={handleClearCompleted}
                onClearAll={handleClearAll}
                onStart={start}
                onPause={pause}
                onComplete={complete}
                onEdit={(task) => setEditingTask(task)}
                onDelete={(task) => setDeletingTask(task)}
                onReset={handleReset}
                onAdjustDuration={handleAdjustDuration}
              />
            </DndContext>
          </>
        )}
      </Box>

      {/* Add task modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={addTask.isPending}
      />

      {/* Edit task modal */}
      <TaskForm
        isOpen={!!editingTask}
        onClose={() => setEditingTask(undefined)}
        onSubmit={handleEditSubmit}
        editingTask={editingTask}
        isLoading={updateTask.isPending}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(undefined)}
        onConfirm={handleDeleteConfirm}
        title="Delete task"
        message={`Delete "${deletingTask?.title}"? This cannot be undone.`}
        isLoading={deleteTask.isPending}
      />
    </Box>
  )
}
