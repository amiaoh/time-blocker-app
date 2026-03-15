import { Box, HStack } from '@chakra-ui/react'
import type { Task, TimerState } from '@/types'

import { ActionBtn } from '@/components/shared/ActionBtn'
import { ElapsedBadge } from './ElapsedBadge'
import { formatSeconds } from '@/utils/formatTime'

interface TaskCardActionsProps {
  task: Task
  timerState: TimerState
  taskElapsed: Map<string, number>
  isActive: boolean
  onComplete: () => void
  onDelete: () => void
  onReset: () => void
  onMoveToTop: () => void
  onEdit: () => void
}

export function TaskCardActions({
  task,
  timerState,
  taskElapsed,
  isActive,
  onComplete,
  onDelete,
  onReset,
  onMoveToTop,
  onEdit,
}: TaskCardActionsProps) {
  const isDone = task.status === 'completed' || task.status === 'skipped'
  const isCompleted = task.status === 'completed'
  const isSkipped = task.status === 'skipped'
  const isPending = task.status === 'pending'

  const plannedSeconds = (task.originalDurationMin ?? task.durationMin) * 60
  const completedOvertime = isCompleted && (task.spentSeconds ?? 0) > plannedSeconds
  const activeOvertime = isActive && timerState.elapsedSeconds > plannedSeconds
  const pendingOvertime = isPending && !isActive && (taskElapsed.get(task.id) ?? 0) > plannedSeconds

  return (
    <HStack gap={2} align="center" overflow="hidden">
      {/* Col 1: delete — always */}
      <ActionBtn label="✕" ariaLabel="Delete" onClick={onDelete} hoverColor="red.400" />

      {/* Col 2: ↑ top / ↺ reset / spacer for completed — fixed width for alignment */}
      <Box w={6} flexShrink={0} display="flex" justifyContent="center">
        {!isCompleted && (isActive || isSkipped
          ? <ActionBtn label="↺" ariaLabel="Reset" onClick={onReset} hoverColor="blue.400" />
          : <ActionBtn label="↑" ariaLabel="Move to top of list" onClick={onMoveToTop} hoverColor="white" />
        )}
      </Box>

      {/* Col 3: Complete / Undo complete / absent for skipped */}
      {isCompleted && <ActionBtn label="Undo complete" onClick={onReset} hoverColor="blue.400" />}
      {!isDone && <ActionBtn label="Complete" onClick={onComplete} hoverColor="green.300" />}

      {/* Col 4: edit — pending only */}
      {isPending && <ActionBtn label="✎" ariaLabel="Edit" onClick={onEdit} hoverColor="white" />}

      {/* Elapsed */}
      {isCompleted && <ElapsedBadge label={formatSeconds(task.spentSeconds ?? 0)} isOvertime={completedOvertime} />}
      {isActive && <ElapsedBadge label={formatSeconds(timerState.elapsedSeconds)} isOvertime={activeOvertime} />}
      {isPending && !isActive && <ElapsedBadge label={formatSeconds(taskElapsed.get(task.id) ?? 0)} isOvertime={pendingOvertime} />}
    </HStack>
  )
}
