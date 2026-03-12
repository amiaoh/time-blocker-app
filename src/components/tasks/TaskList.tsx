import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Task, TimerState } from '@/types'

interface TaskListProps {
  tasks: Task[]
  timerState: TimerState
  hideCompleted: boolean
  onToggleHideCompleted: () => void
  onAddTask: () => void
  onClearCompleted: () => void
  onClearAll: () => void
  onStart: (task: Task) => void
  onPause: () => void
  onComplete: () => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onReset: (task: Task) => void
  onAdjustDuration: (task: Task, deltaMin: number) => void
  onChangeIcon: (task: Task, icon: string) => void
}

function TextBtn({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: string
  onClick: () => void
}) {
  return (
    <Text
      as="button"
      fontSize="sm"
      color="gray.500"
      _hover={{ color: 'gray.200' }}
      cursor="pointer"
      bg="transparent"
      border="none"
      p={0}
      display="flex"
      alignItems="center"
      gap={1}
      onClick={onClick}
    >
      {icon} {label}
    </Text>
  )
}

export function TaskList({
  tasks,
  timerState,
  hideCompleted,
  onToggleHideCompleted,
  onAddTask,
  onClearCompleted,
  onClearAll,
  onStart,
  onPause,
  onComplete,
  onEdit,
  onDelete,
  onReset,
  onAdjustDuration,
  onChangeIcon,
}: TaskListProps) {
  const pendingTasks = tasks.filter((t) => t.status === 'pending')
  const doneTasks = tasks.filter((t) => t.status === 'completed' || t.status === 'skipped')
  const visibleTasks = [...pendingTasks, ...(hideCompleted ? [] : doneTasks)]
  const hasDone = doneTasks.length > 0

  if (tasks.length === 0) {
    return (
      <Stack gap={3}>
        <EmptyState />
        <AddTaskCard onClick={onAddTask} />
      </Stack>
    )
  }

  return (
    <Stack gap={3}>
      <SortableContext items={pendingTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            timerState={timerState}
            onStart={onStart}
            onPause={onPause}
            onComplete={onComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            onReset={onReset}
            onAdjustDuration={onAdjustDuration}
            onChangeIcon={onChangeIcon}
          />
        ))}
      </SortableContext>

      {/* Add task placeholder card */}
      <AddTaskCard onClick={onAddTask} />

      {/* Bottom controls */}
      <HStack justify="space-between" pt={1} flexWrap="wrap" gap={2}>
        <TextBtn
          icon="🕶"
          label={hideCompleted ? 'Show completed' : 'Hide completed'}
          onClick={onToggleHideCompleted}
        />
        <HStack gap={4}>
          {hasDone && (
            <TextBtn icon="🎉" label="Clear completed" onClick={onClearCompleted} />
          )}
          <TextBtn icon="🧹" label="Clear all" onClick={onClearAll} />
        </HStack>
      </HStack>
    </Stack>
  )
}

function AddTaskCard({ onClick }: { onClick: () => void }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      w="100%"
      borderRadius="xl"
      borderWidth={2}
      borderStyle="dashed"
      borderColor="gray.700"
      py={5}
      textAlign="center"
      cursor="pointer"
      bg="transparent"
      color="gray.600"
      _hover={{ borderColor: 'gray.500', color: 'gray.400' }}
      transition="border-color 0.15s, color 0.15s"
    >
      <Text fontSize="xl" lineHeight={1}>+</Text>
      <Text fontSize="sm" mt={1}>Add task</Text>
    </Box>
  )
}
