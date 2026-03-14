import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import type { Task, TimerState } from '@/types'
import { formatSeconds } from '@/utils/formatTime'
import { CSS } from '@dnd-kit/utilities'
import { DragHandle } from '@/components/ordering/DragHandle'
import { EmojiPickerPopover } from './EmojiPickerPopover'
import { TimeRangePill } from './TimeRangePill'
import { TaskCardActions } from './TaskCardActions'
import { useSortable } from '@dnd-kit/sortable'

interface TaskCardProps {
  task: Task
  timerState: TimerState
  taskElapsed: Map<string, number>
  taskRemaining: Map<string, number>
  timeRange?: { start: Date; end: Date }
  use24HourTime: boolean
  onComplete: () => void
  onDelete: (task: Task) => void
  onReset: (task: Task) => void
  onMoveToTop: (task: Task) => void
  onChangeIcon: (task: Task, icon: string) => void
}

export function TaskCard({
  task,
  timerState,
  taskElapsed,
  taskRemaining,
  timeRange,
  use24HourTime,
  onComplete,
  onDelete,
  onReset,
  onMoveToTop,
  onChangeIcon,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: task.status === 'completed' || task.status === 'skipped',
  })

  const isActive = timerState.activeTaskId === task.id
  const isDone = task.status === 'completed' || task.status === 'skipped'

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const timeLabel = isActive
    ? formatSeconds(timerState.remainingSeconds)
    : formatSeconds(taskRemaining.get(task.id) ?? task.durationMin * 60)

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={task.color}
      borderRadius="xl"
      role="listitem"
      outline={isActive ? '2px solid white' : 'none'}
      outlineOffset="2px"
      aria-label={`Task: ${task.title}, ${task.durationMin} minutes, ${task.status}`}
    >
      <HStack align="center" gap={3} p={4} pt={timeRange ? 1 : 4}>
        {!isDone ? (
          <DragHandle {...attributes} {...listeners} />
        ) : (
          <Box w={4} flexShrink={0} />
        )}

        <Stack flex={1} minW={0} gap={1}>
          <HStack justifyContent="space-between" alignItems="baseline">
            <EmojiPickerPopover
              currentIcon={task.icon}
              onSelect={(icon) => onChangeIcon(task, icon)}
              disabled={isDone}
            />
            <Text
              fontWeight="semibold"
              color={isDone ? 'gray.500' : 'white'}
              textDecoration={task.status === 'completed' ? 'line-through' : 'none'}
              truncate
            >
              {task.title}
            </Text>
            {timeRange && <TimeRangePill start={timeRange.start} end={timeRange.end} use24HourTime={use24HourTime} />}
          </HStack>

          <TaskCardActions
            task={task}
            timerState={timerState}
            taskElapsed={taskElapsed}
            isActive={isActive}
            timeLabel={timeLabel}
            onComplete={onComplete}
            onDelete={() => onDelete(task)}
            onReset={() => onReset(task)}
            onMoveToTop={() => onMoveToTop(task)}
          />
        </Stack>
      </HStack>
    </Box>
  )
}
