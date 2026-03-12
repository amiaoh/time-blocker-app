import { useState } from 'react'
import { validateTaskForm } from '@/utils/taskValidation'
import type { Task, TaskColor, TaskFormValues, ValidationError } from '@/types'

const DEFAULT_COLOR: TaskColor = '#A78BFA'

function defaultValues(task?: Task): TaskFormValues {
  return {
    title: task?.title ?? '',
    durationMin: task?.durationMin ?? 25,
    color: task?.color ?? DEFAULT_COLOR,
  }
}

export function useTaskForm(task?: Task) {
  const [values, setValues] = useState<TaskFormValues>(defaultValues(task))
  const [errors, setErrors] = useState<ValidationError[]>([])

  function setField<K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => prev.filter((e) => e.field !== field))
  }

  function validate(): boolean {
    const errs = validateTaskForm(values)
    setErrors(errs)
    return errs.length === 0
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
