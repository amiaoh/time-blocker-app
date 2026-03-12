import { Stack } from '@chakra-ui/react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Task, TimerState } from '@/types'

interface TaskListProps {
  tasks: Task[]
  timerState: TimerState
  onStart: (task: Task) => void
  onPause: () => void
  onComplete: () => void
  onSkip: () => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskList({
  tasks,
  timerState,
  onStart,
  onPause,
  onComplete,
  onSkip,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
      <Stack gap={3}>
        {tasks.map((task) => (
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
          />
        ))}
      </Stack>
    </SortableContext>
  )
}
