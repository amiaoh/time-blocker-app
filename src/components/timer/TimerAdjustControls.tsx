import { Button, HStack } from '@chakra-ui/react'
import { TimerToggleButton } from './TimerToggleButton'

interface TimerAdjustControlsProps {
  isRunning: boolean
  showToggle: boolean
  onMinus: () => void
  onPlus: () => void
  onToggle: () => void
}

export function TimerAdjustControls({ isRunning, showToggle, onMinus, onPlus, onToggle }: TimerAdjustControlsProps) {
  return (
    <HStack gap={6} align="center">
      <Button
        variant="ghost"
        fontSize="sm"
        color="gray.500"
        _hover={{ color: 'gray.300', bg: 'transparent' }}
        p={0}
        h="auto"
        minW="auto"
        onClick={onMinus}
        aria-label="Subtract 5 minutes"
      >
        −5m
      </Button>

      {showToggle && <TimerToggleButton isRunning={isRunning} onClick={onToggle} />}

      <Button
        variant="ghost"
        fontSize="sm"
        color="gray.500"
        _hover={{ color: 'gray.300', bg: 'transparent' }}
        p={0}
        h="auto"
        minW="auto"
        onClick={onPlus}
        aria-label="Add 5 minutes"
      >
        +5m
      </Button>
    </HStack>
  )
}
