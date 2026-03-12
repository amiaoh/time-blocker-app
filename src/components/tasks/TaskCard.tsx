import { Badge, Box, HStack, IconButton, Text } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DragHandle } from '@/components/ordering/DragHandle'
import { formatMinutes } from '@/utils/formatTime'
import type { Task, TimerState } from '@/types'

interface TaskCardProps {
  task: Task
  timerState: TimerState
  onStart: (task: Task) => void
  onPause: () => void
  onComplete: () => void
  onSkip: () => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onReset: (task: Task) => void
  onAdjustDuration: (task: Task, deltaMin: number) => void
}

export function TaskCard({
  task,
  timerState,
  onStart,
  onPause,
  onComplete,
  onSkip,
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
      borderWidth={2}
      borderColor={isActive ? task.color : 'gray.800'}
      p={4}
      position="relative"
      overflow="hidden"
      opacity={isDone ? 0.5 : 1}
      transition="border-color 0.2s, opacity 0.2s"
    >
      {/* Left colour accent bar */}
      <Box
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        w={1}
        bg={task.color}
        borderLeftRadius="xl"
      />

      <HStack pl={3} justify="space-between" align="center" gap={3}>
        {!isDone && <DragHandle {...attributes} {...listeners} />}
        {isDone && <Box w={4} flexShrink={0} />}

        <Box flex={1} minW={0}>
          <Text
            fontWeight="semibold"
            color={isDone ? 'gray.500' : 'white'}
            textDecoration={task.status === 'completed' ? 'line-through' : 'none'}
            truncate
          >
            {task.title}
          </Text>
          <HStack gap={2} mt={1} align="center">
            {/* Duration with +/- controls for pending tasks */}
            {!isDone && (
              <>
                <IconButton
                  aria-label="Subtract 5 minutes"
                  size="xs"
                  variant="ghost"
                  color="gray.600"
                  _hover={{ color: 'gray.300' }}
                  minW={5}
                  h={5}
                  onClick={() => onAdjustDuration(task, -5)}
                  disabled={task.durationMin <= 5}
                >
                  −
                </IconButton>
                <Text fontSize="sm" color="gray.400" minW={8} textAlign="center">
                  {formatMinutes(task.durationMin)}
                </Text>
                <IconButton
                  aria-label="Add 5 minutes"
                  size="xs"
                  variant="ghost"
                  color="gray.600"
                  _hover={{ color: 'gray.300' }}
                  minW={5}
                  h={5}
                  onClick={() => onAdjustDuration(task, 5)}
                  disabled={task.durationMin >= 475}
                >
                  +
                </IconButton>
              </>
            )}
            {isDone && (
              <>
                <Text fontSize="sm" color="gray.500">
                  {formatMinutes(task.durationMin)}
                </Text>
                <Badge colorPalette={task.status === 'completed' ? 'green' : 'orange'} size="sm">
                  {task.status}
                </Badge>
              </>
            )}
          </HStack>
        </Box>

        {/* Action buttons */}
        <HStack gap={1}>
          {isDone ? (
            <>
              <IconButton
                aria-label="Reset task"
                size="sm"
                variant="ghost"
                color="gray.500"
                _hover={{ color: 'blue.400' }}
                onClick={() => onReset(task)}
              >
                ↩
              </IconButton>
              <IconButton
                aria-label="Delete task"
                size="sm"
                variant="ghost"
                color="gray.500"
                _hover={{ color: 'red.400' }}
                onClick={() => onDelete(task)}
              >
                ✕
              </IconButton>
            </>
          ) : (
            <>
              {!isActive && (
                <IconButton
                  aria-label="Start task"
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: task.color }}
                  onClick={() => onStart(task)}
                >
                  ▶
                </IconButton>
              )}
              {isActive && timerState.isRunning && (
                <IconButton
                  aria-label="Pause timer"
                  size="sm"
                  variant="ghost"
                  color={task.color}
                  onClick={onPause}
                >
                  ⏸
                </IconButton>
              )}
              {isActive && timerState.isPaused && (
                <IconButton
                  aria-label="Resume timer"
                  size="sm"
                  variant="ghost"
                  color={task.color}
                  onClick={() => onStart(task)}
                >
                  ▶
                </IconButton>
              )}
              {isActive && (
                <>
                  <IconButton
                    aria-label="Complete task"
                    size="sm"
                    variant="ghost"
                    color="green.400"
                    onClick={onComplete}
                  >
                    ✓
                  </IconButton>
                  <IconButton
                    aria-label="Skip task"
                    size="sm"
                    variant="ghost"
                    color="orange.400"
                    onClick={onSkip}
                  >
                    ⏭
                  </IconButton>
                </>
              )}
              <IconButton
                aria-label="Edit task"
                size="sm"
                variant="ghost"
                color="gray.500"
                _hover={{ color: 'white' }}
                onClick={() => onEdit(task)}
              >
                ✎
              </IconButton>
              <IconButton
                aria-label="Delete task"
                size="sm"
                variant="ghost"
                color="gray.500"
                _hover={{ color: 'red.400' }}
                onClick={() => onDelete(task)}
              >
                ✕
              </IconButton>
            </>
          )}
        </HStack>
      </HStack>
    </Box>
  )
}
