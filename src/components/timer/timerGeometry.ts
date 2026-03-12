export const SIZE = 260
export const CX = SIZE / 2
export const CY = SIZE / 2
export const OUTER_R = 110
export const INNER_MARKER_R = 95
export const LABEL_R = 80
export const PRIMARY_COLOR = '#6ee7b7'
export const OVERFLOW_COLOR = '#67e8f9'

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
