import { describe, it, expect } from 'vitest'
import { validateTaskForm } from '@/utils/taskValidation'
import type { TaskFormValues } from '@/types'

const valid: TaskFormValues = { title: 'Write tests', durationMin: 25, color: '#7C4B1A' }

describe('validateTaskForm', () => {
  it('returns no errors for valid input', () => {
    expect(validateTaskForm(valid)).toHaveLength(0)
  })

  it('requires a title', () => {
    const errors = validateTaskForm({ ...valid, title: '' })
    expect(errors).toContainEqual({ field: 'title', message: expect.any(String) })
  })

  it('rejects title that is only whitespace', () => {
    const errors = validateTaskForm({ ...valid, title: '   ' })
    expect(errors).toContainEqual({ field: 'title', message: expect.any(String) })
  })

  it('rejects title over 200 characters', () => {
    const errors = validateTaskForm({ ...valid, title: 'a'.repeat(201) })
    expect(errors).toContainEqual({ field: 'title', message: expect.any(String) })
  })

  it('rejects duration below 1', () => {
    const errors = validateTaskForm({ ...valid, durationMin: 0 })
    expect(errors).toContainEqual({ field: 'durationMin', message: expect.any(String) })
  })

  it('rejects duration above 480', () => {
    const errors = validateTaskForm({ ...valid, durationMin: 481 })
    expect(errors).toContainEqual({ field: 'durationMin', message: expect.any(String) })
  })

  it('accepts boundary values 1 and 480', () => {
    expect(validateTaskForm({ ...valid, durationMin: 1 })).toHaveLength(0)
    expect(validateTaskForm({ ...valid, durationMin: 480 })).toHaveLength(0)
  })
})
