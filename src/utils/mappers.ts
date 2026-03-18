import type { Task, TaskRow, TaskColor, PresetList, PresetListRow, PresetTask, PresetTaskRow } from '@/types'

export function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    durationMin: row.duration_min,
    color: row.color as TaskColor,
    icon: row.icon ?? '📋',
    position: row.position,
    status: row.status,
    spentSeconds: row.spent_seconds ?? undefined,
    originalDurationMin: row.original_duration_min ?? undefined,
    taskDate: row.task_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function rowToPresetList(row: PresetListRow): PresetList {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    icon: row.icon,
    position: row.position,
  }
}

export function rowToPresetTask(row: PresetTaskRow): PresetTask {
  return {
    id: row.id,
    presetId: row.preset_id,
    title: row.title,
    durationMin: row.duration_min,
    color: row.color as TaskColor,
    icon: row.icon,
    position: row.position,
  }
}

export function taskToInsertRow(
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
): Omit<TaskRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: task.userId,
    title: task.title,
    duration_min: task.durationMin,
    color: task.color,
    icon: task.icon,
    position: task.position,
    status: task.status,
    task_date: task.taskDate,
  }
}
