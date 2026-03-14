import { Box, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import type { Task, TimerState } from '@/types'

import { CSS } from '@dnd-kit/utilities'
import { DragHandle } from '@/components/ordering/DragHandle'
import { EmojiPickerPopover } from './EmojiPickerPopover'
import { TaskCardActions } from './TaskCardActions'
import { TimeRangePill } from './TimeRangePill'
import { formatSeconds } from '@/utils/formatTime'
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
      position="relative"
      role="listitem"
      boxShadow={isActive ? 'inset 0 0 0 2px white' : 'none'}
      aria-label={`Task: ${task.title}, ${task.durationMin} minutes, ${task.status}`}
    >
      {timeRange && (
        <Box position="absolute" top={0} right={0}>
          <TimeRangePill
            start={timeRange.start}
            end={timeRange.end}
            cardColor={task.color}
            use24HourTime={use24HourTime}
          />
        </Box>
      )}

      <HStack align="stretch" gap={0}>
        {!isDone ? (
          <DragHandle {...attributes} {...listeners} />
        ) : (
          <Box w={8} flexShrink={0} />
        )}

        {/* 2×2 grid: [emoji][title] / [duration][actions] */}
        <Grid
          templateColumns="auto 1fr"
          templateRows="auto auto"
          columnGap={3}
          rowGap={0}
          flex={1}
          pb={3}
          pr={4}
          pl={2}
          pt={timeRange ? 7 : 3}
          minW={0}
          alignItems="center"
        >
          {/* Row 1 left: emoji */}
          <GridItem display="flex" justifyContent="center">
            <EmojiPickerPopover
              currentIcon={task.icon}
              onSelect={(icon) => onChangeIcon(task, icon)}
              disabled={isDone}
            />
          </GridItem>

          {/* Row 1 right: title */}
          <GridItem minW={0}>
            <Text
              fontWeight="semibold"
              fontSize="md"
              color={isDone ? 'whiteAlpha.500' : 'white'}
              textDecoration={task.status === 'completed' ? 'line-through' : 'none'}
              truncate
            >
              {task.title}
            </Text>
          </GridItem>

          {/* Row 2 left: duration */}
          <GridItem display="flex" justifyContent="center">
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color={isDone ? 'whiteAlpha.400' : 'white'}
              fontVariantNumeric="tabular-nums"
            >
              {timeLabel}
            </Text>
          </GridItem>

          {/* Row 2 right: actions */}
          <GridItem minW={0}>
            <TaskCardActions
              task={task}
              timerState={timerState}
              taskElapsed={taskElapsed}
              isActive={isActive}
              onComplete={onComplete}
              onDelete={() => onDelete(task)}
              onReset={() => onReset(task)}
              onMoveToTop={() => onMoveToTop(task)}
            />
          </GridItem>
        </Grid>
      </HStack>
    </Box>
  )
}
