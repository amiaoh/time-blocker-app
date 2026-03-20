import { HStack, Stack } from '@chakra-ui/react'
import { CheckCheck, Eye, EyeOff, Trash2 } from 'lucide-react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { AddTaskCard } from './AddTaskCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { TextBtn } from '@/components/shared/TextBtn'
import type { Task, TimerState } from '@/types'

interface TaskListProps {
  tasks: Task[]
  timerState: TimerState
  taskElapsed: Map<string, number>
  taskRemaining: Map<string, number>
  taskTimeRanges: Map<string, { start: Date; end: Date }>
  use24HourTime: boolean
  hideCompleted: boolean
  onToggleHideCompleted: () => void
  onAddTask: () => void
  onClearCompleted: () => void
  onClearAll: () => void
  onComplete: (task: Task) => void
  onDelete: (task: Task) => void
  onReset: (task: Task) => void
  onMoveToTop: (task: Task) => void
  onChangeIcon: (task: Task, icon: string) => void
  onEditTitle: (task: Task, title: string) => void
  onEditDuration: (task: Task, durationMin: number) => void
}


export function TaskList({
  tasks,
  timerState,
  taskElapsed,
  taskRemaining,
  taskTimeRanges,
  use24HourTime,
  hideCompleted,
  onToggleHideCompleted,
  onAddTask,
  onClearCompleted,
  onClearAll,
  onComplete,
  onDelete,
  onReset,
  onMoveToTop,
  onChangeIcon,
  onEditTitle,
  onEditDuration,
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
    <Stack gap={3} role="region" aria-label="Task list">
      <SortableContext items={pendingTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            timerState={timerState}
            taskElapsed={taskElapsed}
            taskRemaining={taskRemaining}
            timeRange={taskTimeRanges.get(task.id)}
            use24HourTime={use24HourTime}
            onComplete={() => onComplete(task)}
            onDelete={onDelete}
            onReset={onReset}
            onMoveToTop={onMoveToTop}
            onChangeIcon={onChangeIcon}
            onEditTitle={(title) => onEditTitle(task, title)}
            onEditDuration={(durationMin) => onEditDuration(task, durationMin)}
          />
        ))}
      </SortableContext>

      {/* Add task placeholder card */}
      <AddTaskCard onClick={onAddTask} />

      {/* Bottom controls */}
      <HStack justify="space-between" align="flex-start" pt={1}>
        <Stack gap={1}>
          <TextBtn
            icon={hideCompleted ? <Eye size={14} /> : <EyeOff size={14} />}
            label={hideCompleted ? 'Show completed' : 'Hide completed'}
            onClick={onToggleHideCompleted}
          />
          {hasDone && (
            <TextBtn icon={<CheckCheck size={14} />} label="Clear completed" onClick={onClearCompleted} />
          )}
        </Stack>
        <TextBtn icon={<Trash2 size={14} />} label="Clear all" onClick={onClearAll} />
      </HStack>
    </Stack>
  )
}

