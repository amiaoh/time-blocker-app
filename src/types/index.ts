export type TaskStatus = 'pending' | 'active' | 'completed' | 'skipped'

export type TaskColor =
  | '#7C2D2D'  // high
  | '#7C4B1A'  // medium
  | '#1D3D6B'  // low

export const TASK_COLORS: TaskColor[] = ['#7C2D2D', '#7C4B1A', '#1D3D6B']

export const PRIORITY_COLORS: { color: TaskColor; label: string }[] = [
  { color: '#7C2D2D', label: 'High' },
  { color: '#7C4B1A', label: 'Medium' },
  { color: '#1D3D6B', label: 'Low' },
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
  originalDurationMin?: number
  taskDate: string
  createdAt: string
  updatedAt: string
}

export type TaskInsert = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
export type TaskUpdate = Partial<Pick<Task, 'title' | 'durationMin' | 'color' | 'icon' | 'position' | 'status' | 'spentSeconds' | 'originalDurationMin'>>

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
  original_duration_min?: number | null
  task_date: string
  created_at: string
  updated_at: string
}
