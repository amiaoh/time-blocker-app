import { PRIMARY_COLOR, OVERFLOW_COLOR, sectorPath } from './timerGeometry'

interface PieSectorsProps {
  remainingSeconds: number
  isRunning: boolean
}

export function PieSectors({ remainingSeconds, isRunning }: PieSectorsProps) {
  const primaryProgress = Math.min(1, remainingSeconds / 3600)
  const overflowProgress = Math.max(0, (remainingSeconds - 3600) / 3600)
  const noTransition = isRunning ? undefined : undefined // transition handled by parent

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
          style={{ transition: isRunning ? 'none' : noTransition }}
        />
      )}
    </>
  )
}
