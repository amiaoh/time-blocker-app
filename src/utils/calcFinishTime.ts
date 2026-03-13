import type { ProjectionResult } from '@/types'

/**
 * Calculates the projected finish time given the current time and
 * total remaining minutes across all pending/active tasks.
 */
export function calcFinishTime(now: Date, totalRemainingMinutes: number): ProjectionResult {
  const finishTime = new Date(now.getTime() + totalRemainingMinutes * 60 * 1000)
  return { finishTime, totalRemainingMinutes }
}

export function formatFinishTime(date: Date, use24Hour = false): string {
  return date.toLocaleTimeString([], { hour: use24Hour ? '2-digit' : 'numeric', minute: '2-digit', hour12: !use24Hour })
}
