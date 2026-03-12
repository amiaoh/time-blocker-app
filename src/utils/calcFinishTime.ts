import type { ProjectionResult } from '@/types'

/**
 * Calculates the projected finish time given the current time and
 * total remaining minutes across all pending/active tasks.
 */
export function calcFinishTime(now: Date, totalRemainingMinutes: number): ProjectionResult {
  const finishTime = new Date(now.getTime() + totalRemainingMinutes * 60 * 1000)
  return { finishTime, totalRemainingMinutes }
}

export function formatFinishTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
