import type { Task } from '@/types'

const REBALANCE_THRESHOLD = 0.001

/**
 * Returns a new array with updated positions after moving the item
 * at `activeId` to the slot occupied by `overId`.
 * Uses fractional indexing — only the moved item gets a new position value
 * unless positions become too close and a full rebalance is needed.
 */
export function reorderTasks(tasks: Task[], activeId: string, overId: string): Task[] {
  const sorted = [...tasks].sort((a, b) => a.position - b.position)
  const activeIndex = sorted.findIndex((t) => t.id === activeId)
  const overIndex = sorted.findIndex((t) => t.id === overId)

  if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
    return tasks
  }

  // Build new order array
  const reordered = [...sorted]
  const [moved] = reordered.splice(activeIndex, 1)
  // overIndex is the target slot in the original array; after splicing out activeIndex
  // the target slot is still correct because dnd-kit's over.id always refers to the
  // original item, not a shifted index.
  reordered.splice(overIndex, 0, moved)
  const insertAt = overIndex

  // Compute new fractional position for the moved item
  const prevPos = reordered[insertAt - 1]?.position ?? 0
  const nextPos = reordered[insertAt + 1]?.position ?? (prevPos + 2000)
  const newPos = (prevPos + nextPos) / 2

  if (Math.abs(newPos - prevPos) < REBALANCE_THRESHOLD) {
    return reordered.map((task, i) => ({ ...task, position: (i + 1) * 1000 }))
  }

  return reordered.map((task) =>
    task.id === activeId ? { ...task, position: newPos } : task,
  )
}
