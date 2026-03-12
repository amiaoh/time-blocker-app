import { Box, Text } from '@chakra-ui/react'
import { formatSeconds } from '@/utils/formatTime'

interface TimerDisplayProps {
  remainingSeconds: number
  durationMin: number
  color: string
  isRunning: boolean
}

const SIZE = 180
const STROKE = 8
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerDisplay({ remainingSeconds, durationMin, color, isRunning }: TimerDisplayProps) {
  const totalSeconds = durationMin * 60
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <Box position="relative" w={`${SIZE}px`} h={`${SIZE}px`} mx="auto">
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#2D3748"
          strokeWidth={STROKE}
        />
        {/* Progress arc */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
        />
      </svg>

      {/* Countdown text centered in ring */}
      <Box
        position="absolute"
        inset={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text fontSize="3xl" fontWeight="bold" color="white" fontVariantNumeric="tabular-nums">
          {formatSeconds(remainingSeconds)}
        </Text>
      </Box>
    </Box>
  )
}
