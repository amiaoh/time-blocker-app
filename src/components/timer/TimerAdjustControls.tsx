import { Button, HStack } from '@chakra-ui/react'
import { TimerToggleButton } from './TimerToggleButton'

interface TimerAdjustControlsProps {
  isRunning: boolean
  showToggle: boolean
  onMinus: () => void
  onPlus: () => void
  onToggle: () => void
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
  minW: 'auto',
}

export function TimerAdjustControls({ isRunning, showToggle, onMinus, onPlus, onToggle }: TimerAdjustControlsProps) {
  return (
    <HStack gap={6} align="center">
      <Button {...adjustBtnProps} onClick={onMinus} aria-label="Subtract 5 minutes">
        −5m
      </Button>

      {showToggle && <TimerToggleButton isRunning={isRunning} onClick={onToggle} />}

      <Button {...adjustBtnProps} onClick={onPlus} aria-label="Add 5 minutes">
        +5m
      </Button>
    </HStack>
  )
}
