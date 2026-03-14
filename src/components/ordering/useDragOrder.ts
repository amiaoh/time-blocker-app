import { useState } from 'react'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { reorderTasks } from '@/utils/reorder'

interface UseDragOrderProps<T extends { id: string; position: number }> {
  tasks: T[]
  onReorder: (tasks: T[]) => void
}

export function useDragOrder<T extends { id: string; position: number }>({ tasks, onReorder }: UseDragOrderProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null)

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const reordered = reorderTasks(tasks, String(active.id), String(over.id))
    onReorder(reordered)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) ?? null : null

  return { activeId, activeTask, handleDragStart, handleDragEnd, handleDragCancel }
}
