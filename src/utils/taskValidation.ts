import type { TaskFormValues, ValidationError } from '@/types'

export function validateTaskForm(values: TaskFormValues, maxDurationMin = 120): ValidationError[] {
  const errors: ValidationError[] = []

  if (!values.title.trim()) {
    errors.push({ field: 'title', message: 'Task name is required' })
  } else if (values.title.trim().length > 200) {
    errors.push({ field: 'title', message: 'Task name must be 200 characters or less' })
  }

  if (!Number.isInteger(values.durationMin) || values.durationMin < 1) {
    errors.push({ field: 'durationMin', message: 'Duration must be at least 1 minute' })
  } else if (values.durationMin > maxDurationMin) {
    errors.push({ field: 'durationMin', message: `Duration cannot exceed ${maxDurationMin} minutes` })
  }

  if (!values.color) {
    errors.push({ field: 'color', message: 'Please select a colour' })
  }

  return errors
}
