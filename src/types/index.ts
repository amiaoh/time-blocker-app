export type TaskStatus = 'pending' | 'active' | 'completed' | 'skipped'

export type TaskColor =
  | '#F87171'
  | '#FB923C'
  | '#FBBF24'
  | '#4ADE80'
  | '#60A5FA'
  | '#A78BFA'
  | '#F472B6'
  | '#94A3B8'

export const TASK_COLORS: TaskColor[] = [
  '#F87171',
  '#FB923C',
  '#FBBF24',
  '#4ADE80',
  '#60A5FA',
  '#A78BFA',
  '#F472B6',
  '#94A3B8',
]

export interface Task {
  id: string
  sessionId: string
  title: string
  durationMin: number
  color: TaskColor
  icon: string
  position: number
  status: TaskStatus
  spentSeconds?: number
  taskDate: string
  createdAt: string
  updatedAt: string
}

export type TaskInsert = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
export type TaskUpdate = Partial<Pick<Task, 'title' | 'durationMin' | 'color' | 'icon' | 'position' | 'status' | 'spentSeconds'>>

export interface TaskFormValues {
  title: string
  durationMin: number
  color: TaskColor
}

export interface ValidationError {
  field: keyof TaskFormValues
  message: string
}

export interface TimerState {
  activeTaskId: string | null
  remainingSeconds: number
  elapsedSeconds: number
  isRunning: boolean
  isPaused: boolean
}

export interface ProjectionResult {
  finishTime: Date
  totalRemainingMinutes: number
}

export interface PresetList {
  id: string
  sessionId: string
  name: string
  icon: string
  position: number
}

export interface PresetTask {
  id: string
  presetId: string
  title: string
  durationMin: number
  color: TaskColor
  icon: string
  position: number
}

// Supabase DB row shapes (snake_case)
export interface PresetListRow {
  id: string
  session_id: string
  name: string
  icon: string
  position: number
  created_at: string
  updated_at: string
}

export interface PresetTaskRow {
  id: string
  preset_id: string
  title: string
  duration_min: number
  color: string
  icon: string
  position: number
}

// Supabase DB row shape (snake_case)
export interface TaskRow {
  id: string
  session_id: string
  title: string
  duration_min: number
  color: string
  icon: string
  position: number
  status: TaskStatus
  spent_seconds?: number | null
  task_date: string
  created_at: string
  updated_at: string
}
