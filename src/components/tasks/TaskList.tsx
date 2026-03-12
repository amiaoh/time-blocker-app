import { Box, HStack, Switch, Text, Stack } from '@chakra-ui/react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Task, TimerState } from '@/types'

interface TaskListProps {
  tasks: Task[]
  timerState: TimerState
  hideCompleted: boolean
  onToggleHideCompleted: () => void
  onStart: (task: Task) => void
  onPause: () => void
  onComplete: () => void
  onSkip: () => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onReset: (task: Task) => void
  onAdjustDuration: (task: Task, deltaMin: number) => void
}

export function TaskList({
  tasks,
  timerState,
  hideCompleted,
  onToggleHideCompleted,
  onStart,
  onPause,
  onComplete,
  onSkip,
  onEdit,
  onDelete,
  onReset,
  onAdjustDuration,
}: TaskListProps) {
  const pendingTasks = tasks.filter((t) => t.status === 'pending')
  const doneTasks = tasks.filter((t) => t.status === 'completed' || t.status === 'skipped')

  const visibleTasks = [
    ...pendingTasks,
    ...(hideCompleted ? [] : doneTasks),
  ]

  const hasDone = doneTasks.length > 0

  if (tasks.length === 0) return <EmptyState />

  return (
    <Stack gap={3}>
      {/* Hide completed toggle — only shown when there are done tasks */}
      {hasDone && (
        <HStack justify="flex-end" align="center" gap={2}>
          <Text fontSize="xs" color="gray.500">
            Hide completed
          </Text>
          <Switch.Root
            size="sm"
            checked={hideCompleted}
            onCheckedChange={onToggleHideCompleted}
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </HStack>
      )}

      <SortableContext items={pendingTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            timerState={timerState}
            onStart={onStart}
            onPause={onPause}
            onComplete={onComplete}
            onSkip={onSkip}
            onEdit={onEdit}
            onDelete={onDelete}
            onReset={onReset}
            onAdjustDuration={onAdjustDuration}
          />
        ))}
      </SortableContext>

      {hideCompleted && hasDone && (
        <Box textAlign="center">
          <Text fontSize="xs" color="gray.600">
            {doneTasks.length} completed task{doneTasks.length !== 1 ? 's' : ''} hidden
          </Text>
        </Box>
      )}
    </Stack>
  )
}
