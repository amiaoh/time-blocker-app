import { useEffect, useState } from 'react'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { reorderTasks } from '@/utils/reorder'

interface UseDragOrderProps<T extends { id: string; position: number }> {
  tasks: T[]
  onReorder: (tasks: T[]) => void
}

export function useDragOrder<T extends { id: string; position: number }>({ tasks, onReorder }: UseDragOrderProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [optimisticTasks, setOptimisticTasks] = useState<T[] | null>(null)

  // Clear optimistic state once the server tasks reflect the reordered IDs
  useEffect(() => {
    if (optimisticTasks === null) return
    const serverIds = tasks.map((t) => t.id).join(',')
    const optimisticIds = optimisticTasks.map((t) => t.id).join(',')
    if (serverIds === optimisticIds) setOptimisticTasks(null)
  }, [tasks, optimisticTasks])

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const reordered = reorderTasks(tasks, String(active.id), String(over.id))
    setOptimisticTasks(reordered)
    onReorder(reordered)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  const displayTasks = optimisticTasks ?? tasks
  const activeTask = activeId ? displayTasks.find((t) => t.id === activeId) ?? null : null

  return { activeId, activeTask, displayTasks, handleDragStart, handleDragEnd, handleDragCancel }
}
