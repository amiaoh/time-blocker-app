import { Box, Text } from '@chakra-ui/react'
import { formatSeconds } from '@/utils/formatTime'

interface TimerDisplayProps {
  remainingSeconds: number
  durationMin: number
  color: string
  isRunning: boolean
  isIdle: boolean
}

const SIZE = 200
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerDisplay({ remainingSeconds, durationMin, color, isRunning, isIdle }: TimerDisplayProps) {
  const totalSeconds = durationMin * 60
  const progress = isIdle || totalSeconds === 0 ? 0 : remainingSeconds / totalSeconds
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const ringColor = isIdle ? '#2D3748' : color

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#1A202C"
          strokeWidth={STROKE}
        />
        {/* Progress arc */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={isIdle ? 0 : dashOffset}
          style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
        />
      </svg>

      <Text
        fontSize="4xl"
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
