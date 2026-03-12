import { useCallback, useEffect, useRef, useState } from 'react'
import { useChime } from './useChime'
import type { Task, TimerState } from '@/types'

const INITIAL_STATE: TimerState = {
  activeTaskId: null,
  remainingSeconds: 0,
  isRunning: false,
  isPaused: false,
}

interface UseTimerReturn {
  timerState: TimerState
  start: (task: Task) => void
  pause: () => void
  resume: () => void
  complete: () => void
  skip: () => void
  reset: () => void
}

interface UseTimerCallbacks {
  onComplete: (taskId: string) => void
  onSkip: (taskId: string) => void
}

export function useTimer({ onComplete, onSkip }: UseTimerCallbacks): UseTimerReturn {
  const [timerState, setTimerState] = useState<TimerState>(INITIAL_STATE)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { play: playChime } = useChime()

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    setTimerState((prev: TimerState) => {
      if (prev.remainingSeconds <= 1) {
        return { ...prev, remainingSeconds: 0, isRunning: false }
      }
      return { ...prev, remainingSeconds: prev.remainingSeconds - 1 }
    })
  }, [])

  // Watch for timer reaching zero to fire chime
  useEffect(() => {
    setTimerState((prev: TimerState) => {
      if (prev.remainingSeconds === 0 && !prev.isRunning && prev.activeTaskId !== null) {
        clearTick()
        playChime()
      }
      return prev
    })
  }, [timerState.remainingSeconds, timerState.isRunning, clearTick, playChime])

  const start = useCallback(
    (task: Task) => {
      clearTick()
      setTimerState({
        activeTaskId: task.id,
        remainingSeconds: task.durationMin * 60,
        isRunning: true,
        isPaused: false,
      })
      intervalRef.current = setInterval(tick, 1000)
    },
    [clearTick, tick],
  )

  const pause = useCallback(() => {
    clearTick()
    setTimerState((prev: TimerState) => ({ ...prev, isRunning: false, isPaused: true }))
  }, [clearTick])

  const resume = useCallback(() => {
    setTimerState((prev: TimerState) => ({ ...prev, isRunning: true, isPaused: false }))
    intervalRef.current = setInterval(tick, 1000)
  }, [tick])

  const complete = useCallback(() => {
    clearTick()
    const id = timerState.activeTaskId
    setTimerState(INITIAL_STATE)
    if (id) onComplete(id)
  }, [clearTick, timerState.activeTaskId, onComplete])

  const skip = useCallback(() => {
    clearTick()
    const id = timerState.activeTaskId
    setTimerState(INITIAL_STATE)
    if (id) onSkip(id)
  }, [clearTick, timerState.activeTaskId, onSkip])

  const reset = useCallback(() => {
    clearTick()
    setTimerState(INITIAL_STATE)
  }, [clearTick])

  // Cleanup on unmount
  useEffect(() => () => clearTick(), [clearTick])

  return { timerState, start, pause, resume, complete, skip, reset }
}
