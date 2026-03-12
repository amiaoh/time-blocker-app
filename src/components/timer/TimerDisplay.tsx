import { Box, Text } from '@chakra-ui/react'
import { formatSeconds } from '@/utils/formatTime'

interface TimerDisplayProps {
  remainingSeconds: number
  durationMin: number
  color: string
  isRunning: boolean
  isIdle: boolean
  onToggle?: () => void // play/pause from centre button
}

const SIZE = 260
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER_R = 110
const INNER_MARKER_R = 95   // inner end of tick marks
const LABEL_R = 80          // radius for number labels

const CLOCK_MARKS = Array.from({ length: 12 }, (_, i) => i * 5) // 0,5,10,...55

function polarToXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function sectorPath(progress: number): string {
  if (progress <= 0) return ''
  if (progress >= 1) {
    // Full circle as two half-arcs
    return [
      `M ${CX} ${CY}`,
      `L ${CX} ${CY - OUTER_R}`,
      `A ${OUTER_R} ${OUTER_R} 0 1 1 ${CX - 0.001} ${CY - OUTER_R}`,
      `A ${OUTER_R} ${OUTER_R} 0 1 1 ${CX} ${CY - OUTER_R}`,
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

export function TimerDisplay({
  remainingSeconds,
  durationMin,
  color,
  isRunning,
  isIdle,
  onToggle,
}: TimerDisplayProps) {
  const totalSeconds = durationMin * 60
  // Show remaining proportion (sector shrinks as time passes = countdown)
  const progress = isIdle || totalSeconds === 0 ? 0 : remainingSeconds / totalSeconds

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <svg width={SIZE} height={SIZE} style={{ userSelect: 'none' }}>
        {/* Background circle */}
        <circle cx={CX} cy={CY} r={OUTER_R} fill="#1A202C" />

        {/* Remaining sector (full at start, shrinks to 0) */}
        {!isIdle && progress > 0 && (
          <path
            d={sectorPath(progress)}
            fill={color}
            opacity={0.85}
            style={{ transition: isRunning ? 'none' : undefined }}
          />
        )}

        {/* Clock tick marks and labels */}
        {CLOCK_MARKS.map((mark) => {
          const angleDeg = (mark / 60) * 360
          const outer = polarToXY(angleDeg, OUTER_R + 2)
          const inner = polarToXY(angleDeg, INNER_MARKER_R + 4)
          const label = polarToXY(angleDeg, LABEL_R + 16)
          return (
            <g key={mark}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="#4A5568"
                strokeWidth={mark === 0 ? 2 : 1}
              />
              <text
                x={label.x}
                y={label.y}
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
          cx={CX}
          cy={CY}
          r={28}
          fill={isIdle ? '#2D3748' : '#0F0F0F'}
          style={{ cursor: onToggle ? 'pointer' : 'default' }}
          onClick={onToggle}
        />
        <text
          x={CX}
          y={CY + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={15}
          fill={isIdle ? '#4A5568' : 'white'}
          style={{ cursor: onToggle ? 'pointer' : 'default', pointerEvents: 'none', userSelect: 'none' }}
        >
          {isRunning ? '⏸' : '▶'}
        </text>
      </svg>

      {/* Numerical time below the ring */}
      <Text
        fontSize="3xl"
        fontWeight="bold"
        color={isIdle ? 'gray.600' : 'white'}
        fontVariantNumeric="tabular-nums"
        letterSpacing="wider"
        mt={-2}
      >
        {isIdle ? '--:--' : formatSeconds(remainingSeconds)}
      </Text>
    </Box>
  )
}
