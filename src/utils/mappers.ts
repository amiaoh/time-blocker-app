import type { Task, TaskRow, TaskColor } from '@/types'

export function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    sessionId: row.session_id,
    title: row.title,
    durationMin: row.duration_min,
    color: row.color as TaskColor,
    position: row.position,
    status: row.status,
    taskDate: row.task_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function taskToInsertRow(
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
): Omit<TaskRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    session_id: task.sessionId,
    title: task.title,
    duration_min: task.durationMin,
    color: task.color,
    position: task.position,
    status: task.status,
    task_date: task.taskDate,
  }
}
