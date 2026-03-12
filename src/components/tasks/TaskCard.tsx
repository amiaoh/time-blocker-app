import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import type { Task, TimerState } from '@/types'
import { formatSeconds, formatTimeShort } from '@/utils/formatTime'

import { CSS } from '@dnd-kit/utilities'
import { DragHandle } from '@/components/ordering/DragHandle'
import { EmojiPickerPopover } from './EmojiPickerPopover'
import { useSortable } from '@dnd-kit/sortable'

interface TaskCardProps {
  task: Task
  timerState: TimerState
  taskElapsed: Map<string, number>
  timeRange?: { start: Date; end: Date }
  onComplete: () => void
  onDelete: (task: Task) => void
  onReset: (task: Task) => void
  onMoveToTop: (task: Task) => void
  onChangeIcon: (task: Task, icon: string) => void
}

function ActionBtn({
  label,
  onClick,
  color = 'gray.500',
  hoverColor = 'white',
  ariaLabel,
}: {
  label: string
  onClick: () => void
  color?: string
  hoverColor?: string
  ariaLabel?: string
}) {
  return (
    <Text
      as="button"
      fontSize="sm"
      color={color}
      _hover={{ color: hoverColor }}
      cursor="pointer"
      onClick={onClick}
      bg="transparent"
      border="none"
      p={0}
      flexShrink={0}
      aria-label={ariaLabel ?? label}
    >
      {label}
    </Text>
  )
}


export function TaskCard({
  task,
  timerState,
  taskElapsed,
  timeRange,
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

  // Time display: active shows remaining, inactive pending shows accumulated elapsed (or 00:00), done shows allocated
  const timeLabel = isActive
    ? formatSeconds(timerState.remainingSeconds)
    : isDone
      ? formatSeconds(task.durationMin * 60)
      : formatSeconds(taskElapsed.get(task.id) ?? 0)

  // Spent time for completed cards
  const spentLabel = formatSeconds(task.spentSeconds ?? 0)

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={isActive ? 'gray.800' : 'gray.900'}
      borderRadius="xl"
      role="listitem"
      aria-label={`Task: ${task.title}, ${task.durationMin} minutes, ${task.status}`}
    >


      <HStack align="center" gap={3} p={4} pt={timeRange ? 1 : 4}>
        {/* Drag handle */}
        {!isDone ? (
          <DragHandle {...attributes} {...listeners} />
        ) : (
          <Box w={4} flexShrink={0} />
        )}

        {/* Title + actions */}
        <Stack flex={1} minW={0} gap={1}>
          <HStack justifyContent={"space-between"} alignItems={"baseline"}>
             <EmojiPickerPopover
            currentIcon={task.icon}
            color={task.color}
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
            {/* Time range pill */}
            {timeRange && (
              <HStack pt={2}>
                <Text fontSize="xs" color="gray.300" fontVariantNumeric="tabular-nums" backgroundColor={"teal.700"} borderRadius={4} paddingX={2}>
                  {formatTimeShort(timeRange.start)} → {formatTimeShort(timeRange.end)}
                </Text>
              </HStack>
            )}
          </HStack>
          {/* Actions row — time first, then buttons */}
          <HStack gap={2} align="center" overflow="hidden" justifyContent={"space-between"}>
            <Text
              fontSize="sm"
              color={isDone ? 'gray.600' : 'gray.400'}
              fontVariantNumeric="tabular-nums"
              flexShrink={0}
            >
              {timeLabel}
            </Text>

            {task.status === 'completed' ? (
              <>
                <ActionBtn label="Delete" onClick={() => onDelete(task)} hoverColor="red.400" />
                {/* Spacer to align Undo complete with Complete on other cards */}
                <Box minW="1.75rem" flexShrink={0} />
                <ActionBtn label="Undo complete" onClick={() => onReset(task)} hoverColor="blue.400" />
                <Text fontSize="xs" color="gray.600" flexShrink={0} fontVariantNumeric="tabular-nums" backgroundColor="gray.400" borderRadius={4} paddingX={2}>
                  {spentLabel}
                </Text>
              </>
            ) : task.status === 'skipped' ? (
              <>
                <ActionBtn label="Delete" onClick={() => onDelete(task)} hoverColor="red.400" />
                <ActionBtn label="Reset" onClick={() => onReset(task)} hoverColor="blue.400" />
              </>
            ) : isActive ? (
              <>
                <ActionBtn label="Delete" onClick={() => onDelete(task)} hoverColor="red.400" />
                <ActionBtn label="Reset" onClick={() => onReset(task)} hoverColor="blue.400" />
                <ActionBtn label="Complete" onClick={onComplete} hoverColor="green.300" />
                <Text fontSize="xs" color="gray.600" flexShrink={0} fontVariantNumeric="tabular-nums" backgroundColor={"gray.400"} borderRadius={4} paddingX={2}>
                  {formatSeconds(timerState.elapsedSeconds)}
                </Text>
              </>
            ) : (
              <>
                <ActionBtn label="Delete" onClick={() => onDelete(task)} hoverColor="red.400" />
                <ActionBtn label="Top" onClick={() => onMoveToTop(task)} hoverColor="white" ariaLabel="Move to top of list" />
                <ActionBtn label="Complete" onClick={onComplete} hoverColor="green.300" />
                <Text fontSize="xs" color="gray.600" flexShrink={0} fontVariantNumeric="tabular-nums" backgroundColor="gray.400" borderRadius={4} paddingX={2}>
                  {formatSeconds(taskElapsed.get(task.id) ?? 0)}
                </Text>
</>
            )}
          </HStack>
        </Stack>
      </HStack>
    </Box>
  )
}
