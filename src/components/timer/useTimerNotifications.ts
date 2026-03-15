import { useEffect, useLayoutEffect, useRef } from 'react'
import type { Task, TimerState } from '@/types'
import { showTimerNotification } from '@/utils/notifications'

export function useTimerNotifications(timerState: TimerState, activeTask: Task | null) {
  // Mirror of timerState in a ref so scheduling effects can read current values
  // without depending on every tick
  const stateRef = useRef(timerState)
  const taskRef = useRef(activeTask)
  useLayoutEffect(() => { stateRef.current = timerState }, [timerState])
  useLayoutEffect(() => { taskRef.current = activeTask }, [activeTask])

  const oneMinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const overtimeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function cancelScheduled() {
    if (oneMinTimeoutRef.current !== null) { clearTimeout(oneMinTimeoutRef.current); oneMinTimeoutRef.current = null }
    if (overtimeTimeoutRef.current !== null) { clearTimeout(overtimeTimeoutRef.current); overtimeTimeoutRef.current = null }
  }

  // Re-schedule when timer starts/resumes or task changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    cancelScheduled()
    if (!timerState.isRunning || !activeTask) return

    const remaining = stateRef.current.remainingSeconds
    const title = taskRef.current?.title ?? 'Task'

    if (remaining > 60) {
      oneMinTimeoutRef.current = setTimeout(() => {
        showTimerNotification('⏰ 1 minute remaining', title)
      }, (remaining - 60) * 1000)
    }

    if (remaining > 0) {
      overtimeTimeoutRef.current = setTimeout(() => {
        showTimerNotification("⏰ Time's up!", title)
      }, remaining * 1000)
    }

    return cancelScheduled
  }, [timerState.isRunning, timerState.activeTaskId]) // intentionally excludes remainingSeconds to avoid rescheduling every tick
}
