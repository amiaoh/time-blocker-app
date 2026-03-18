export const SIZE = 200
export const CX = SIZE / 2
export const CY = SIZE / 2
export const OUTER_R = 84
export const INNER_MARKER_R = 72
export const PLAY_BTN_R = 28

// Sector colors
export const PRIMARY_COLOR = '#6ee7b7'
export const OVERFLOW_COLOR = '#67e8f9'
export const OVERTIME_COLOR = '#FC8181' // red.300

// SVG element colors
export const TIMER_BG = '#1A202C'
export const TICK_COLOR = '#4A5568'
export const TICK_LABEL_COLOR = '#718096'
export const PLAY_BTN_BG_IDLE = '#2D3748'
export const PLAY_BTN_BG_ACTIVE = '#0F0F0F'

// 5-minute interval marks around the clock face: [0, 5, 10, ..., 55]
export const CLOCK_MARKS = Array.from({ length: 12 }, (_, i) => i * 5)

export const SECONDS_PER_HOUR = 3600

export function polarToXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

export function sectorPath(progress: number): string {
  if (progress <= 0) return ''
  if (progress >= 1) {
    return [
      `M ${CX} ${CY}`,
      `L ${CX} ${CY - OUTER_R}`,
      `A ${OUTER_R} ${OUTER_R} 0 1 1 ${CX - 0.001} ${CY - OUTER_R}`,
      'Z',
    ].join(' ')
  }
  const angleDeg = progress * 360
  const end = polarToXY(angleDeg, OUTER_R)
  const largeArc = angleDeg > 180 ? 1 : 0
  return [
    `M ${CX} ${CY}`,
    `L ${CX} ${CY - OUTER_R}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}
