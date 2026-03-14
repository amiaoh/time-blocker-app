import type { TaskColor } from '@/types'
import { emojiFromTaskName } from './emojiFromTaskName'

interface TodoistApiTask {
  id: string
  content: string
  priority: number // API: 4=P1(urgent), 3=P2(high), 2=P3(medium), 1=P4(normal)
  due: { date: string } | null
  is_completed: boolean
}

interface TodoistTasksResponse {
  results: TodoistApiTask[]
  nextCursor: string | null
}

function priorityToColor(priority: number): TaskColor {
  if (priority === 4) return '#7C2D2D' // P1 → high
  if (priority === 3) return '#7C4B1A' // P2 → medium
  return '#1D3D6B'                      // P3/P4 → low
}

export interface MappedTodoistTask {
  id: string
  title: string
  color: TaskColor
  icon: string
  durationMin: number
}

export async function fetchTodayTodoistTasks(token: string): Promise<MappedTodoistTask[]> {
  const allTasks: TodoistApiTask[] = []
  let cursor: string | null = null

  do {
    const params = new URLSearchParams({ query: 'today' })
    if (cursor) params.set('cursor', cursor)
    const response = await fetch(`/api/todoist/tasks/filter?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.status === 401) throw new Error('Invalid Todoist API token')
    if (!response.ok) throw new Error(`Todoist API error: ${response.status}`)

    const json = (await response.json()) as TodoistTasksResponse
    allTasks.push(...json.results)
    cursor = json.nextCursor
  } while (cursor)

  return allTasks
    .filter((t) => !t.is_completed)
    .map((t) => ({
      id: t.id,
      title: t.content,
      color: priorityToColor(t.priority),
      icon: emojiFromTaskName(t.content),
      durationMin: 25,
    }))
}
