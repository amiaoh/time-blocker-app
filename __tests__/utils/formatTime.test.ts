import { describe, it, expect } from 'vitest'
import { formatSeconds, formatMinutes } from '@/utils/formatTime'

describe('formatSeconds', () => {
  it('formats zero as 00:00', () => expect(formatSeconds(0)).toBe('00:00'))
  it('formats 65 seconds as 01:05', () => expect(formatSeconds(65)).toBe('01:05'))
  it('formats 3600 seconds as 60:00', () => expect(formatSeconds(3600)).toBe('60:00'))
  it('clamps negative values to 00:00', () => expect(formatSeconds(-5)).toBe('00:00'))
  it('floors fractional seconds', () => expect(formatSeconds(59.9)).toBe('00:59'))
})

describe('formatMinutes', () => {
  it('shows minutes only for < 60', () => expect(formatMinutes(25)).toBe('25m'))
  it('shows hours only when no remainder', () => expect(formatMinutes(120)).toBe('2h'))
  it('shows hours and minutes', () => expect(formatMinutes(90)).toBe('1h 30m'))
  it('handles zero', () => expect(formatMinutes(0)).toBe('0m'))
})
