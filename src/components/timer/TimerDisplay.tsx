import { Box, Text } from '@chakra-ui/react'
import { CX, CY, OUTER_R, SIZE, TIMER_BG } from './timerGeometry'

import { ClockMarks } from './ClockMarks'
import { PieSectors } from './PieSectors'
import { SvgPlayPause } from './SvgPlayPause'
import { formatSeconds } from '@/utils/formatTime'

interface TimerDisplayProps {
  remainingSeconds: number
  isRunning: boolean
  isIdle: boolean
  isOvertime: boolean
  overtimeSeconds: number
  showPie?: boolean
  onToggle?: () => void
}

export function TimerDisplay({ remainingSeconds, isRunning, isIdle, isOvertime, overtimeSeconds, showPie = true, onToggle }: TimerDisplayProps) {
  const timeLabel = isOvertime ? formatSeconds(overtimeSeconds) : formatSeconds(remainingSeconds)

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {showPie && (
        <svg
          width={SIZE}
          height={SIZE}
          style={{ userSelect: 'none' }}
          role="img"
          aria-label={isIdle ? 'Timer idle' : isOvertime ? `${formatSeconds(overtimeSeconds)} overtime` : `${formatSeconds(remainingSeconds)} remaining`}
        >
          <circle cx={CX} cy={CY} r={OUTER_R} fill={TIMER_BG} />
          {!isIdle && <PieSectors remainingSeconds={remainingSeconds} isRunning={isRunning} isOvertime={isOvertime} overtimeSeconds={overtimeSeconds} />}
          <ClockMarks />
          <SvgPlayPause isRunning={isRunning} isIdle={isIdle} onClick={onToggle} />
        </svg>
      )}

      <Text
        fontSize="3xl"
        fontWeight="bold"
        color={isIdle ? 'gray.600' : isOvertime ? 'red.400' : 'white'}
        fontVariantNumeric="tabular-nums"
        letterSpacing="wider"
        mt={-2}
        aria-live="off"
        aria-atomic="true"
      >
        {isIdle ? null : timeLabel}
      </Text>
    </Box>
  )
}
