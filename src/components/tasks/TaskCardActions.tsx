import { Box, HStack, Text } from '@chakra-ui/react'
import { ActionBtn } from '@/components/shared/ActionBtn'
import { ElapsedBadge } from './ElapsedBadge'
import { formatSeconds } from '@/utils/formatTime'
import type { Task, TimerState } from '@/types'

interface TaskCardActionsProps {
  task: Task
  timerState: TimerState
  taskElapsed: Map<string, number>
  isActive: boolean
  timeLabel: string
  onComplete: () => void
  onDelete: () => void
  onReset: () => void
  onMoveToTop: () => void
}

export function TaskCardActions({
  task,
  timerState,
  taskElapsed,
  isActive,
  timeLabel,
  onComplete,
  onDelete,
  onReset,
  onMoveToTop,
}: TaskCardActionsProps) {
  const isDone = task.status === 'completed' || task.status === 'skipped'

  return (
    <HStack gap={2} align="center" overflow="hidden" justifyContent="space-between">
      <Text fontSize="sm" color={isDone ? 'gray.600' : 'gray.400'} fontVariantNumeric="tabular-nums" flexShrink={0}>
        {timeLabel}
      </Text>

      {task.status === 'completed' ? (
        <>
          <ActionBtn label="Delete" onClick={onDelete} hoverColor="red.400" />
          <Box minW="1.75rem" flexShrink={0} />
          <ActionBtn label="Undo complete" onClick={onReset} hoverColor="blue.400" />
          <ElapsedBadge label={formatSeconds(task.spentSeconds ?? 0)} />
        </>
      ) : task.status === 'skipped' ? (
        <>
          <ActionBtn label="Delete" onClick={onDelete} hoverColor="red.400" />
          <ActionBtn label="Reset" onClick={onReset} hoverColor="blue.400" />
        </>
      ) : isActive ? (
        <>
          <ActionBtn label="Delete" onClick={onDelete} hoverColor="red.400" />
          <ActionBtn label="Reset" onClick={onReset} hoverColor="blue.400" />
          <ActionBtn label="Complete" onClick={onComplete} hoverColor="green.300" />
          <ElapsedBadge label={formatSeconds(timerState.elapsedSeconds)} />
        </>
      ) : (
        <>
          <ActionBtn label="Delete" onClick={onDelete} hoverColor="red.400" />
          <ActionBtn label="Top" onClick={onMoveToTop} hoverColor="white" ariaLabel="Move to top of list" />
          <ActionBtn label="Complete" onClick={onComplete} hoverColor="green.300" />
          <ElapsedBadge label={formatSeconds(taskElapsed.get(task.id) ?? 0)} />
        </>
      )}
    </HStack>
  )
}
