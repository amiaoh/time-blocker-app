import { Box, Button, HStack, Text } from '@chakra-ui/react'
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
  onMinus?: () => void
  onPlus?: () => void
}

const adjustBtnProps = {
  variant: 'ghost' as const,
  fontSize: 'sm',
  color: 'gray.500',
  _hover: { color: 'gray.300', bg: 'whiteAlpha.100' },
  _active: { bg: 'whiteAlpha.200', opacity: 0.8 },
  px: 3,
  py: 2,
  h: 'auto',
  minW: '42px',
}

export function TimerDisplay({ remainingSeconds, isRunning, isIdle, isOvertime, overtimeSeconds, showPie = true, onToggle, onMinus, onPlus }: TimerDisplayProps) {
  const timeLabel = isOvertime ? formatSeconds(overtimeSeconds) : formatSeconds(remainingSeconds)

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {showPie && (
        <svg
          width={SIZE}
          height={SIZE}
          style={{ userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
          role="img"
          aria-label={isIdle ? 'Timer idle' : isOvertime ? `${formatSeconds(overtimeSeconds)} overtime` : `${formatSeconds(remainingSeconds)} remaining`}
        >
          <circle cx={CX} cy={CY} r={OUTER_R} fill={TIMER_BG} />
          {!isIdle && <PieSectors remainingSeconds={remainingSeconds} isRunning={isRunning} isOvertime={isOvertime} overtimeSeconds={overtimeSeconds} />}
          <ClockMarks />
          <SvgPlayPause isRunning={isRunning} isIdle={isIdle} onClick={onToggle} />
        </svg>
      )}

      <HStack gap={5} align="center" mt={-2}>
        {onMinus && showPie ? (
          <Button {...adjustBtnProps} onClick={onMinus} aria-label="Subtract 5 minutes">−5m</Button>
        ) : <Box minW="32px" />}

        <Text
          fontSize="3xl"
          fontWeight="bold"
          color={isIdle ? 'gray.600' : isOvertime ? 'red.400' : 'white'}
          fontVariantNumeric="tabular-nums"
          letterSpacing="wider"
          aria-live="off"
          aria-atomic="true"
        >
          {isIdle ? null : timeLabel}
        </Text>

        {onPlus && showPie ? (
          <Button {...adjustBtnProps} onClick={onPlus} aria-label="Add 5 minutes">+5m</Button>
        ) : <Box minW="32px" />}
      </HStack>
    </Box>
  )
}
