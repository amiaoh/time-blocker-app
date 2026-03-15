import type { TaskColor } from '@/types'

export interface ParsedTaskInput {
  title: string
  durationMin?: number
  color?: TaskColor
}

const PRIORITY_COLORS: Record<number, TaskColor> = {
  1: '#7C2D2D',
  2: '#7C4B1A',
  3: '#1D3D6B',
}

/**
 * Extracts optional shorthand tokens from raw task input:
 *   - `p1` / `p2` / `p3` → priority colour
 *   - a standalone integer → duration in minutes
 *
 * Returns cleaned title + any extracted values.
 */
export function parseTaskInput(raw: string): ParsedTaskInput {
  let title = raw
  let durationMin: number | undefined
  let color: TaskColor | undefined

  // Extract p1 / p2 / p3 (whole word, case-insensitive)
  title = title.replace(/\bp([123])\b/gi, (_, p) => {
    color = PRIORITY_COLORS[parseInt(p)]
    return ''
  })

  // Extract a standalone integer as duration
  title = title.replace(/\b(\d+)\b/, (_, n) => {
    durationMin = parseInt(n, 10)
    return ''
  })

  return { title: title.replace(/\s+/g, ' ').trim(), durationMin, color }
}
