import { PRIMARY_COLOR, OVERFLOW_COLOR, OVERTIME_COLOR, SECONDS_PER_HOUR, sectorPath } from './timerGeometry'

interface PieSectorsProps {
  remainingSeconds: number
  isRunning: boolean
  isOvertime: boolean
  overtimeSeconds: number
}

export function PieSectors({ remainingSeconds, isRunning, isOvertime, overtimeSeconds }: PieSectorsProps) {
  const primaryProgress = Math.min(1, remainingSeconds / SECONDS_PER_HOUR)
  const overflowProgress = Math.max(0, (remainingSeconds - SECONDS_PER_HOUR) / SECONDS_PER_HOUR)
  const overtimeProgress = isOvertime ? Math.min(1, overtimeSeconds / SECONDS_PER_HOUR) : 0

  if (isOvertime) {
    return overtimeProgress > 0 ? (
      <path
        d={sectorPath(overtimeProgress)}
        fill={OVERTIME_COLOR}
        opacity={0.85}
      />
    ) : null
  }

  return (
    <>
      {primaryProgress > 0 && (
        <path
          d={sectorPath(primaryProgress)}
          fill={PRIMARY_COLOR}
          opacity={0.8}
          style={{ transition: isRunning ? 'none' : undefined }}
        />
      )}
      {overflowProgress > 0 && (
        <path
          d={sectorPath(overflowProgress)}
          fill={OVERFLOW_COLOR}
          opacity={0.85}
          style={{ transition: isRunning ? 'none' : undefined }}
        />
      )}
    </>
  )
}
