import { Box, Text } from '@chakra-ui/react'
import type { Task, TimerState } from '@/types'
import { useEffect, useRef, useState } from 'react'

import { EmojiPickerPopover } from './EmojiPickerPopover'
import { TaskCardActions } from './TaskCardActions'
import { TimeRangePill } from './TimeRangePill'
import { InlineEdit } from '@/components/shared/InlineEdit'
import { BaseTaskCard } from '@/components/shared/BaseTaskCard'
import { formatSeconds } from '@/utils/formatTime'

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
  onEditTitle: (title: string) => void
  onEditDuration: (durationMin: number) => void
}

export function TaskCard({
  task, timerState, taskElapsed, taskRemaining, timeRange, use24HourTime,
  onComplete, onDelete, onReset, onMoveToTop, onChangeIcon, onEditTitle, onEditDuration,
}: TaskCardProps) {
  const isActive = timerState.activeTaskId === task.id
  const isDone = task.status === 'completed' || task.status === 'skipped'
  const isCompleted = task.status === 'completed'

  const prevDoneRef = useRef(isDone)
  const [completing, setCompleting] = useState(false)
  useEffect(() => {
    if (!prevDoneRef.current && isDone) {
      setCompleting(true)
      const t = setTimeout(() => setCompleting(false), 450)
      return () => clearTimeout(t)
    }
    prevDoneRef.current = isDone
  }, [isDone])

  const timeLabel = isActive
    ? formatSeconds(timerState.remainingSeconds)
    : formatSeconds(taskRemaining.get(task.id) ?? task.durationMin * 60)

  const activeBoxShadow = isActive
    ? 'inset 0 0 0 2.5px white, 0 0 0 4px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.6)'
    : 'none'

  return (
    <BaseTaskCard
      id={task.id}
      bg={task.color}
      dragDisabled={isDone}
      pt={timeRange ? 7 : 3}
      boxShadow={activeBoxShadow}
      zIndex={isActive ? 1 : 'auto'}
      className={completing ? 'task-card-completing' : undefined}
      role="listitem"
      ariaLabel={`Task: ${task.title}, ${task.durationMin} minutes, ${task.status}`}
      overlay={timeRange ? (
        <Box position="absolute" top={0} right={0}>
          <TimeRangePill
            start={timeRange.start}
            end={timeRange.end}
            cardColor={task.color}
            use24HourTime={use24HourTime}
          />
        </Box>
      ) : undefined}
      icon={
        <EmojiPickerPopover
          currentIcon={task.icon}
          onSelect={(icon) => onChangeIcon(task, icon)}
          disabled={isDone}
        />
      }
      title={
        !isDone ? (
          <InlineEdit displayValue={task.title} editValue={task.title} onSave={onEditTitle}
            fontWeight="semibold" fontSize="md" color="white" lineClamp={2} />
        ) : (
          <Text fontWeight="semibold" fontSize="md"
            color="whiteAlpha.500"
            textDecoration={isCompleted ? 'line-through' : 'none'}
            lineClamp={2}>
            {task.title}
          </Text>
        )
      }
      duration={
        !isCompleted ? (
          !isDone ? (
            <InlineEdit displayValue={timeLabel} editValue={String(task.durationMin)}
              onSave={(v) => onEditDuration(Number(v))}
              type="number" min={1} max={480} fontSize="xs" fontWeight="semibold"
              color="white" fontVariantNumeric="tabular-nums" inputWidth="3.5rem" />
          ) : (
            <Text fontSize="xs" fontWeight="semibold" color="whiteAlpha.400" fontVariantNumeric="tabular-nums">
              {timeLabel}
            </Text>
          )
        ) : undefined
      }
      actions={
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
      }
    />
  )
}
