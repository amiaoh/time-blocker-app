import { useCallback, useState } from 'react'
import { Box, Button, HStack, Heading, Spinner, Text } from '@chakra-ui/react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { FinishTimeBar } from '@/components/projection/FinishTimeBar'
import { useTimer } from '@/components/timer/useTimer'
import { useDragOrder } from '@/components/ordering/useDragOrder'
import { useProjection } from '@/components/projection/useProjection'
import { useTasks, useAddTask, useUpdateTask, useDeleteTask } from '@/components/tasks/useTasks'
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

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
  const [deletingTask, setDeletingTask] = useState<Task | undefined>(undefined)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleComplete = useCallback(
    (taskId: string) => updateTask.mutate(
      { id: taskId, status: 'completed' },
      {
        onSuccess: () => toaster.create({ title: 'Task completed!', type: 'success', duration: 2000 }),
        onError: (err) => toaster.create({ title: 'Failed to update task', description: errorMessage(err), type: 'error' }),
      },
    ),
    [updateTask],
  )

  const handleSkip = useCallback(
    (taskId: string) => updateTask.mutate(
      { id: taskId, status: 'skipped' },
      {
        onSuccess: () => toaster.create({ title: 'Task skipped', type: 'info', duration: 2000 }),
        onError: (err) => toaster.create({ title: 'Failed to update task', description: errorMessage(err), type: 'error' }),
      },
    ),
    [updateTask],
  )

  const { timerState, start, pause, resume, complete, skip } = useTimer({
    onComplete: handleComplete,
    onSkip: handleSkip,
  })

  const { handleDragStart, handleDragEnd, handleDragCancel } = useDragOrder({
    tasks,
    onReorder: (reordered) => {
      reordered.forEach((task) => updateTask.mutate({ id: task.id, position: task.position }))
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
        onError: (err) => {
          toaster.create({ title: 'Failed to add task', description: errorMessage(err), type: 'error' })
        },
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
        onError: (err) => {
          toaster.create({ title: 'Failed to update task', description: errorMessage(err), type: 'error' })
        },
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
      onError: (err) => {
        toaster.create({ title: 'Failed to delete task', description: errorMessage(err), type: 'error' })
      },
    })
  }

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <Box minH="100vh" bg="gray.950" pb="80px">
      <Box maxW="560px" mx="auto" px={4} pt={8}>
        {/* Header */}
        <HStack justify="space-between" align="center" mb={6}>
          <Box>
            <Heading size="lg" color="white">Today</Heading>
            <Text color="gray.500" fontSize="sm">{today}</Text>
          </Box>
          <Button
            onClick={() => setIsFormOpen(true)}
            bg="brand.600"
            color="white"
            _hover={{ bg: 'brand.500' }}
            size="sm"
          >
            + Add task
          </Button>
        </HStack>

        {/* Load error */}
        {loadError && (
          <Box bg="red.900" borderRadius="lg" p={4} mb={4}>
            <Text color="red.200" fontSize="sm" fontWeight="semibold">Failed to load tasks</Text>
            <Text color="red.300" fontSize="xs" mt={1}>{errorMessage(loadError)}</Text>
          </Box>
        )}

        {/* Active timer display */}
        {activeTask && (
          <Box
            bg="gray.900"
            borderRadius="2xl"
            p={6}
            mb={6}
            borderWidth={1}
            borderColor={activeTask.color}
          >
            <Text color="gray.400" fontSize="sm" textAlign="center" mb={1}>
              Now focusing on
            </Text>
            <Text color="white" fontWeight="semibold" textAlign="center" mb={4} fontSize="lg">
              {activeTask.title}
            </Text>
            <TimerDisplay
              remainingSeconds={timerState.remainingSeconds}
              durationMin={activeTask.durationMin}
              color={activeTask.color}
              isRunning={timerState.isRunning}
            />
            <Box mt={4}>
              <TimerControls
                isRunning={timerState.isRunning}
                isPaused={timerState.isPaused}
                onPause={pause}
                onResume={resume}
                onComplete={complete}
                onSkip={skip}
                accentColor={activeTask.color}
              />
            </Box>
          </Box>
        )}

        {/* Task list */}
        {isLoading ? (
          <Box textAlign="center" py={12}>
            <Spinner color="brand.400" />
          </Box>
        ) : (
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
              onStart={start}
              onPause={pause}
              onComplete={complete}
              onSkip={skip}
              onEdit={(task) => setEditingTask(task)}
              onDelete={(task) => setDeletingTask(task)}
            />
          </DndContext>
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

      {/* Finish time footer */}
      <FinishTimeBar projection={projection} />
    </Box>
  )
}
