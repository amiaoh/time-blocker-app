import { describe, it, expect } from 'vitest'
import { reorderTasks } from '@/utils/reorder'
import type { Task } from '@/types'

function makeTask(id: string, position: number): Task {
  return {
    id,
    sessionId: 'sess',
    title: id,
    durationMin: 25,
    color: '#7C4B1A',
    position,
    status: 'pending',
    taskDate: '2024-01-01',
    createdAt: '',
    updatedAt: '',
  }
}

describe('reorderTasks', () => {
  const tasks = [
    makeTask('a', 1000),
    makeTask('b', 2000),
    makeTask('c', 3000),
  ]

  it('moves a task down', () => {
    const result = reorderTasks(tasks, 'a', 'c')
    const sorted = [...result].sort((x, y) => x.position - y.position)
    expect(sorted.map((t) => t.id)).toEqual(['b', 'a', 'c'])
  })

  it('moves a task up', () => {
    const result = reorderTasks(tasks, 'c', 'a')
    const sorted = [...result].sort((x, y) => x.position - y.position)
    expect(sorted.map((t) => t.id)).toEqual(['c', 'a', 'b'])
  })

  it('returns unchanged array when activeId equals overId', () => {
    const result = reorderTasks(tasks, 'a', 'a')
    expect(result).toEqual(tasks)
  })

  it('returns unchanged array when id not found', () => {
    const result = reorderTasks(tasks, 'z', 'a')
    expect(result).toEqual(tasks)
  })

  it('preserves all tasks', () => {
    const result = reorderTasks(tasks, 'a', 'c')
    expect(result).toHaveLength(tasks.length)
  })

  it('assigns unique positions', () => {
    const result = reorderTasks(tasks, 'a', 'b')
    const positions = result.map((t) => t.position)
    const unique = new Set(positions)
    expect(unique.size).toBe(positions.length)
  })
})
