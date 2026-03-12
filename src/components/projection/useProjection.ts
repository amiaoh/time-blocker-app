import { useMemo } from 'react'
import { calcFinishTime } from '@/utils/calcFinishTime'
import type { ProjectionResult, Task, TimerState } from '@/types'

export function useProjection(tasks: Task[], timerState: TimerState): ProjectionResult {
  return useMemo(() => {
    const activeRemainingMin = timerState.activeTaskId !== null
      ? timerState.remainingSeconds / 60
      : 0

    const pendingMin = tasks
      .filter((t) => t.status === 'pending' && t.id !== timerState.activeTaskId)
      .reduce((sum, t) => sum + t.durationMin, 0)

    const totalRemainingMinutes = Math.ceil(activeRemainingMin + pendingMin)
    return calcFinishTime(new Date(), totalRemainingMinutes)
  }, [tasks, timerState])
}
