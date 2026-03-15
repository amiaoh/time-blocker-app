import { useState } from 'react'
import { validateTaskForm } from '@/utils/taskValidation'
import { parseTaskInput } from '@/utils/parseTaskInput'
import type { Task, TaskColor, TaskFormValues, ValidationError } from '@/types'

const DEFAULT_COLOR: TaskColor = '#7C4B1A'

function defaultValues(task?: Task): TaskFormValues {
  return {
    title: task?.title ?? '',
    durationMin: task?.durationMin ?? 25,
    color: task?.color ?? DEFAULT_COLOR,
  }
}

export function useTaskForm(task?: Task, maxDurationMin = 120) {
  const [values, setValues] = useState<TaskFormValues>(defaultValues(task))
  const [errors, setErrors] = useState<ValidationError[]>([])

  function setField<K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) {
    setValues((prev: TaskFormValues) => ({ ...prev, [field]: value }))
    setErrors((prev: ValidationError[]) => prev.filter((e) => e.field !== field))
  }

  /** Parses shorthand from the title, validates, and returns merged values or null on error. */
  function validate(): TaskFormValues | null {
    const parsed = parseTaskInput(values.title)
    const merged: TaskFormValues = {
      title: parsed.title,
      durationMin: parsed.durationMin ?? values.durationMin,
      color: parsed.color ?? values.color,
    }
    const errs = validateTaskForm(merged, maxDurationMin)
    setErrors(errs)
    if (errs.length > 0) return null
    setValues(merged)
    return merged
  }

  function reset() {
    setValues(defaultValues(task))
    setErrors([])
  }

  function errorFor(field: keyof TaskFormValues): string | undefined {
    return errors.find((e) => e.field === field)?.message
  }

  return { values, setField, errors, validate, reset, errorFor }
}
