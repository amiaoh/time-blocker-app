import { Box, Text } from '@chakra-ui/react'

import { formatSeconds } from '@/utils/formatTime'

interface TimerDisplayProps {
  remainingSeconds: number
  isRunning: boolean
  isIdle: boolean
  onToggle?: () => void
}

const SIZE = 260
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER_R = 110
const INNER_MARKER_R = 95
const LABEL_R = 80

// Kitchen-timer model: the clock face represents 60 minutes.
// Primary sector (mint): the current 0-60 min countdown — starts full, shrinks to 0.
// Overflow sector (cyan): time beyond 60 min — shown on top of primary, shrinks first.
// e.g. 90 min remaining: full mint circle (60 min) + cyan half-circle (30 min on top)
const PRIMARY_COLOR = '#6ee7b7'  // mint green — the active countdown
const OVERFLOW_COLOR = '#67e8f9' // light cyan — the extra time beyond 60 min

const CLOCK_MARKS = Array.from({ length: 12 }, (_, i) => i * 5)

function polarToXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function sectorPath(progress: number): string {
  if (progress <= 0) return ''
  if (progress >= 1) {
    // Single large arc to near-top avoids the double-arc artifact
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

export function TimerDisplay({ remainingSeconds, isRunning, isIdle, onToggle }: TimerDisplayProps) {
  // Primary: how far through the current 60-min lap (1 = full circle, counts down to 0)
  const primaryProgress = isIdle ? 0 : Math.min(1, remainingSeconds / 3600)
  // Overflow: extra time beyond the first 60 min (shown on top in cyan, shrinks first)
  const overflowProgress = isIdle ? 0 : Math.max(0, (remainingSeconds - 3600) / 3600)

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <svg
        width={SIZE}
        height={SIZE}
        style={{ userSelect: 'none' }}
        role="img"
        aria-label={isIdle ? 'Timer idle' : `${formatSeconds(remainingSeconds)} remaining`}
      >
        <circle cx={CX} cy={CY} r={OUTER_R} fill="#1A202C" />

        {/* Primary sector — mint green, counts 60 min → 0 */}
        {!isIdle && primaryProgress > 0 && (
          <path
            d={sectorPath(primaryProgress)}
            fill={PRIMARY_COLOR}
            opacity={0.8}
            style={{ transition: isRunning ? 'none' : undefined }}
          />
        )}

        {/* Overflow sector — cyan, shown on top when remaining > 60 min, shrinks first */}
        {!isIdle && overflowProgress > 0 && (
          <path
            d={sectorPath(overflowProgress)}
            fill={OVERFLOW_COLOR}
            opacity={0.85}
            style={{ transition: isRunning ? 'none' : undefined }}
          />
        )}

        {/* Clock tick marks and labels */}
        {CLOCK_MARKS.map((mark) => {
          const angleDeg = (mark / 60) * 360
          const outer = polarToXY(angleDeg, OUTER_R)
          const inner = polarToXY(angleDeg, INNER_MARKER_R + 4)
          const label = polarToXY(angleDeg, LABEL_R + 40)
          return (
            <g key={mark}>
              <line
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke="#4A5568"
                strokeWidth={mark === 0 ? 2 : 1}
              />
              <text
                x={label.x} y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fill="#718096"
                fontFamily="system-ui, sans-serif"
              >
                {mark}
              </text>
            </g>
          )
        })}

        {/* Centre play/pause button */}
        <circle
          cx={CX} cy={CY} r={28}
          fill={isIdle ? '#2D3748' : '#0F0F0F'}
          style={{ cursor: onToggle ? 'pointer' : 'default' }}
          onClick={onToggle}
          role={onToggle ? 'button' : undefined}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          tabIndex={onToggle ? 0 : undefined}
        />
        <text
          x={CX} y={CY + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={15}
          fill={isIdle ? '#4A5568' : 'white'}
          aria-hidden="true"
          style={{ cursor: onToggle ? 'pointer' : 'default', pointerEvents: 'none', userSelect: 'none' }}
        >
          {isRunning ? '⏸' : '▶'}
        </text>
      </svg>

      <Text
        fontSize="3xl"
        fontWeight="bold"
        color={isIdle ? 'gray.600' : 'white'}
        fontVariantNumeric="tabular-nums"
        letterSpacing="wider"
        mt={-2}
        aria-live="off"
        aria-atomic="true"
        aria-label={isIdle ? 'No timer running' : `Time remaining: ${formatSeconds(remainingSeconds)}`}
      >
        {isIdle ? '--:--' : formatSeconds(remainingSeconds)}
      </Text>
    </Box>
  )
}
