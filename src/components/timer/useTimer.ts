import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useChime } from './useChime'
import type { Task, TimerState } from '@/types'

const INITIAL_STATE: TimerState = {
  activeTaskId: null,
  remainingSeconds: 0,
  elapsedSeconds: 0,
  isRunning: false,
  isPaused: false,
}

interface UseTimerReturn {
  timerState: TimerState
  taskElapsed: Map<string, number>
  taskRemaining: Map<string, number>
  select: (task: Task) => void
  start: (task: Task) => void
  pause: () => void
  resume: () => void
  complete: () => void
  skip: () => void
  clearTaskTimer: (taskId: string) => void
  adjustRemaining: (deltaMin: number) => void
}

interface UseTimerCallbacks {
  onComplete: (taskId: string, elapsedSeconds: number) => void
  onSkip: (taskId: string) => void
}

export function useTimer({ onComplete, onSkip }: UseTimerCallbacks): UseTimerReturn {
  const [timerState, setTimerState] = useState<TimerState>(INITIAL_STATE)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { play: playChime } = useChime()

  // Always-current ref so callbacks don't go stale — useLayoutEffect keeps it synchronous before effects fire
  const stateRef = useRef<TimerState>(INITIAL_STATE)
  useLayoutEffect(() => { stateRef.current = timerState }, [timerState])

  // Per-task accumulated elapsed + remaining seconds (persists when switching tasks)
  const taskElapsedRef = useRef<Map<string, number>>(new Map())
  const taskRemainingRef = useRef<Map<string, number>>(new Map())
  const [taskElapsed, setTaskElapsed] = useState<Map<string, number>>(new Map())
  const [taskRemaining, setTaskRemaining] = useState<Map<string, number>>(new Map())

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    setTimerState((prev) => {
      if (prev.remainingSeconds <= 1) {
        return { ...prev, remainingSeconds: 0, elapsedSeconds: prev.elapsedSeconds + 1, isRunning: false }
      }
      return { ...prev, remainingSeconds: prev.remainingSeconds - 1, elapsedSeconds: prev.elapsedSeconds + 1 }
    })
  }, [])

  // Watch for timer reaching zero
  useEffect(() => {
    if (timerState.remainingSeconds === 0 && !timerState.isRunning && timerState.activeTaskId !== null) {
      clearTick()
      playChime()
    }
  }, [timerState.remainingSeconds, timerState.isRunning, timerState.activeTaskId, clearTick, playChime])

  const saveCurrentElapsed = useCallback(() => {
    const { activeTaskId, elapsedSeconds, remainingSeconds } = stateRef.current
    if (activeTaskId) {
      taskElapsedRef.current.set(activeTaskId, elapsedSeconds)
      taskRemainingRef.current.set(activeTaskId, remainingSeconds)
      setTaskElapsed(new Map(taskElapsedRef.current))
      setTaskRemaining(new Map(taskRemainingRef.current))
    }
  }, [])

  const select = useCallback((task: Task) => {
    clearTick()
    saveCurrentElapsed()
    const prevElapsed = taskElapsedRef.current.get(task.id) ?? 0
    const prevRemaining = taskRemainingRef.current.get(task.id) ?? task.durationMin * 60
    setTimerState({
      activeTaskId: task.id,
      remainingSeconds: prevRemaining,
      elapsedSeconds: prevElapsed,
      isRunning: false,
      isPaused: false,
    })
  }, [clearTick, saveCurrentElapsed])

  const start = useCallback((task: Task) => {
    clearTick()
    saveCurrentElapsed()
    const prevElapsed = taskElapsedRef.current.get(task.id) ?? 0
    const prevRemaining = taskRemainingRef.current.get(task.id) ?? task.durationMin * 60
    setTimerState({
      activeTaskId: task.id,
      remainingSeconds: prevRemaining,
      elapsedSeconds: prevElapsed,
      isRunning: true,
      isPaused: false,
    })
    intervalRef.current = setInterval(tick, 1000)
  }, [clearTick, saveCurrentElapsed, tick])

  const pause = useCallback(() => {
    clearTick()
    setTimerState((prev) => ({ ...prev, isRunning: false, isPaused: true }))
  }, [clearTick])

  const resume = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isRunning: true, isPaused: false }))
    intervalRef.current = setInterval(tick, 1000)
  }, [tick])

  const complete = useCallback(() => {
    clearTick()
    const { activeTaskId, elapsedSeconds } = stateRef.current
    if (activeTaskId) {
      taskElapsedRef.current.delete(activeTaskId)
      taskRemainingRef.current.delete(activeTaskId)
      setTaskElapsed(new Map(taskElapsedRef.current))
      setTaskRemaining(new Map(taskRemainingRef.current))
    }
    setTimerState(INITIAL_STATE)
    if (activeTaskId) onComplete(activeTaskId, elapsedSeconds)
  }, [clearTick, onComplete])

  const skip = useCallback(() => {
    clearTick()
    const { activeTaskId } = stateRef.current
    if (activeTaskId) {
      taskElapsedRef.current.delete(activeTaskId)
      taskRemainingRef.current.delete(activeTaskId)
      setTaskElapsed(new Map(taskElapsedRef.current))
      setTaskRemaining(new Map(taskRemainingRef.current))
    }
    setTimerState(INITIAL_STATE)
    if (activeTaskId) onSkip(activeTaskId)
  }, [clearTick, onSkip])

  const clearTaskTimer = useCallback((taskId: string) => {
    const { activeTaskId } = stateRef.current
    taskElapsedRef.current.delete(taskId)
    taskRemainingRef.current.delete(taskId)
    setTaskElapsed(new Map(taskElapsedRef.current))
    setTaskRemaining(new Map(taskRemainingRef.current))
    if (activeTaskId === taskId) {
      clearTick()
      setTimerState(INITIAL_STATE)
    }
  }, [clearTick])

  const adjustRemaining = useCallback((deltaMin: number) => {
    setTimerState((prev) => ({
      ...prev,
      remainingSeconds: Math.max(0, prev.remainingSeconds + deltaMin * 60),
    }))
  }, [])

  useEffect(() => () => clearTick(), [clearTick])

  return { timerState, taskElapsed, taskRemaining, select, start, pause, resume, complete, skip, clearTaskTimer, adjustRemaining }
}
