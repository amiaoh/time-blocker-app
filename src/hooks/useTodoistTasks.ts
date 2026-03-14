import { useQuery } from '@tanstack/react-query'
import { fetchTodayTodoistTasks } from '@/utils/todoistApi'

export function useTodoistTasks(token: string | undefined) {
  return useQuery({
    queryKey: ['todoist-tasks', token],
    queryFn: () => fetchTodayTodoistTasks(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
