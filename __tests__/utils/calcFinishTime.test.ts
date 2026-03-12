import { describe, it, expect } from 'vitest'
import { calcFinishTime } from '@/utils/calcFinishTime'

describe('calcFinishTime', () => {
  it('adds remaining minutes to now', () => {
    const now = new Date('2024-01-01T10:00:00')
    const result = calcFinishTime(now, 30)
    expect(result.finishTime).toEqual(new Date('2024-01-01T10:30:00'))
    expect(result.totalRemainingMinutes).toBe(30)
  })

  it('returns now when no remaining minutes', () => {
    const now = new Date('2024-01-01T10:00:00')
    const result = calcFinishTime(now, 0)
    expect(result.finishTime).toEqual(now)
  })

  it('handles crossing midnight', () => {
    const now = new Date('2024-01-01T23:45:00')
    const result = calcFinishTime(now, 30)
    expect(result.finishTime).toEqual(new Date('2024-01-02T00:15:00'))
  })

  it('handles large durations', () => {
    const now = new Date('2024-01-01T08:00:00')
    const result = calcFinishTime(now, 480) // 8 hours
    expect(result.finishTime).toEqual(new Date('2024-01-01T16:00:00'))
  })
})
