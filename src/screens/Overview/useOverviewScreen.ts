import { useSessionId } from '@/hooks/useSessionId'
import { useTasks } from '@/components/tasks/useTasks'

export function useOverviewScreen() {
  const sessionId = useSessionId()
  const { data: tasks = [], isLoading } = useTasks(sessionId)

  const completedTasks = tasks.filter(t => t.status === 'completed')
  const remainingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'active')

  const totalPlannedMin = tasks.reduce((sum, t) => sum + t.durationMin, 0)
  const totalSpentSeconds = tasks.reduce((sum, t) => sum + (t.spentSeconds ?? 0), 0)
  const totalSpentMin = Math.floor(totalSpentSeconds / 60)

  return { completedTasks, remainingTasks, totalPlannedMin, totalSpentMin, isLoading }
}
