import { Box, Text } from '@chakra-ui/react'
import { CX, CY, OUTER_R, SIZE } from './timerGeometry'

import { ClockMarks } from './ClockMarks'
import { PieSectors } from './PieSectors'
import { SvgPlayPause } from './SvgPlayPause'
import { formatSeconds } from '@/utils/formatTime'

interface TimerDisplayProps {
  remainingSeconds: number
  isRunning: boolean
  isIdle: boolean
  showPie?: boolean
  onToggle?: () => void
}

export function TimerDisplay({ remainingSeconds, isRunning, isIdle, showPie = true, onToggle }: TimerDisplayProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {showPie && (
        <svg
          width={SIZE}
          height={SIZE}
          style={{ userSelect: 'none' }}
          role="img"
          aria-label={isIdle ? 'Timer idle' : `${formatSeconds(remainingSeconds)} remaining`}
        >
          <circle cx={CX} cy={CY} r={OUTER_R} fill="#1A202C" />
          {!isIdle && <PieSectors remainingSeconds={remainingSeconds} isRunning={isRunning} />}
          <ClockMarks />
          <SvgPlayPause isRunning={isRunning} isIdle={isIdle} onClick={onToggle} />
        </svg>
      )}

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
        {isIdle ? null : formatSeconds(remainingSeconds)}
      </Text>
    </Box>
  )
}
