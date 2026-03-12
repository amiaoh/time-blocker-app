import { Box, HStack, Text } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DragHandle } from '@/components/ordering/DragHandle'
import { formatMinutes, formatSeconds } from '@/utils/formatTime'
import type { Task, TimerState } from '@/types'

interface TaskCardProps {
  task: Task
  timerState: TimerState
  onStart: (task: Task) => void
  onPause: () => void
  onComplete: () => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onReset: (task: Task) => void
  onAdjustDuration: (task: Task, deltaMin: number) => void
}

function ActionBtn({
  label,
  onClick,
  color = 'gray.500',
  hoverColor = 'white',
}: {
  label: string
  onClick: () => void
  color?: string
  hoverColor?: string
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
    >
      {label}
    </Text>
  )
}

export function TaskCard({
  task,
  timerState,
  onStart,
  onPause,
  onComplete,
  onEdit,
  onDelete,
  onReset,
  onAdjustDuration,
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

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg="gray.900"
      borderRadius="xl"
      p={4}
      opacity={isDone ? 0.6 : 1}
      transition="opacity 0.2s"
    >
      <HStack align="flex-start" gap={3}>
        {/* Drag handle */}
        {!isDone ? (
          <Box pt={1}>
            <DragHandle {...attributes} {...listeners} />
          </Box>
        ) : (
          <Box w={4} flexShrink={0} />
        )}

        {/* Colour icon square */}
        <Box
          w={10}
          h={10}
          borderRadius="lg"
          bg={task.color}
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="lg"
          cursor={isDone ? 'default' : 'pointer'}
          onClick={isDone ? undefined : () => onEdit(task)}
        >
          📋
        </Box>

        {/* Title + actions */}
        <Box flex={1} minW={0}>
          <Text
            fontWeight="semibold"
            color={isDone ? 'gray.500' : 'white'}
            textDecoration={task.status === 'completed' ? 'line-through' : 'none'}
            truncate
            mb={1}
          >
            {task.title}
          </Text>

          <HStack gap={3} align="center" flexWrap="wrap">
            {/* Duration with +/- for pending */}
            {!isDone ? (
              <HStack gap={1} align="center">
                <Text
                  as="button"
                  fontSize="xs"
                  color="gray.600"
                  _hover={{ color: 'gray.300' }}
                  cursor="pointer"
                  onClick={() => onAdjustDuration(task, -5)}
                  _disabled={{ opacity: 0.3, cursor: 'not-allowed' }}
                  aria-disabled={task.durationMin <= 5}
                  bg="transparent"
                  border="none"
                  p={0}
                >
                  −
                </Text>
                <Text fontSize="sm" color="gray.400" minW={8} textAlign="center">
                  {formatMinutes(task.durationMin)}
                </Text>
                <Text
                  as="button"
                  fontSize="xs"
                  color="gray.600"
                  _hover={{ color: 'gray.300' }}
                  cursor="pointer"
                  onClick={() => onAdjustDuration(task, 5)}
                  _disabled={{ opacity: 0.3, cursor: 'not-allowed' }}
                  aria-disabled={task.durationMin >= 475}
                  bg="transparent"
                  border="none"
                  p={0}
                >
                  +
                </Text>
              </HStack>
            ) : (
              <Text fontSize="sm" color="gray.500">
                {formatMinutes(task.durationMin)}
              </Text>
            )}

            {/* Separator */}
            <Box w="1px" h={3} bg="gray.700" />

            {/* Context-sensitive action buttons */}
            {isDone ? (
              <>
                <ActionBtn label="Delete" onClick={() => onDelete(task)} hoverColor="red.400" />
                <ActionBtn label="Reset" onClick={() => onReset(task)} hoverColor="blue.400" />
              </>
            ) : isActive ? (
              <>
                <ActionBtn label="Delete" onClick={() => onDelete(task)} hoverColor="red.400" />
                <ActionBtn label="Reset" onClick={() => onReset(task)} hoverColor="blue.400" />
                <ActionBtn
                  label="Complete"
                  onClick={onComplete}
                  color="green.500"
                  hoverColor="green.300"
                />
              </>
            ) : (
              <>
                <ActionBtn label="Delete" onClick={() => onDelete(task)} hoverColor="red.400" />
                <ActionBtn label="Edit" onClick={() => onEdit(task)} hoverColor="white" />
              </>
            )}
          </HStack>
        </Box>

        {/* Right side: timer badge (active) or pause/play (pending) */}
        <Box flexShrink={0} display="flex" alignItems="center" pt={1}>
          {isActive ? (
            <Box
              bg="gray.800"
              borderRadius="md"
              px={2}
              py={1}
              cursor="pointer"
              onClick={timerState.isRunning ? onPause : () => onStart(task)}
            >
              <Text fontSize="xs" color="white" fontVariantNumeric="tabular-nums">
                {formatSeconds(timerState.remainingSeconds)}
              </Text>
            </Box>
          ) : !isDone ? (
            <Box
              as="button"
              onClick={() => onStart(task)}
              color="gray.500"
              _hover={{ color: 'white' }}
              cursor="pointer"
              fontSize="lg"
              bg="transparent"
              border="none"
              p={0}
            >
              ▶
            </Box>
          ) : null}
        </Box>
      </HStack>
    </Box>
  )
}
