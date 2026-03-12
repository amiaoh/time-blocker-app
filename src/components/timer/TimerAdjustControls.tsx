import { HStack, Text } from '@chakra-ui/react'
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
      <Text
        as="button"
        fontSize="sm"
        color="gray.500"
        _hover={{ color: 'gray.300' }}
        cursor="pointer"
        bg="transparent"
        border="none"
        p={0}
        onClick={onMinus}
        aria-label="Subtract 5 minutes"
      >
        −5m
      </Text>

      {showToggle && <TimerToggleButton isRunning={isRunning} onClick={onToggle} />}

      <Text
        as="button"
        fontSize="sm"
        color="gray.500"
        _hover={{ color: 'gray.300' }}
        cursor="pointer"
        bg="transparent"
        border="none"
        p={0}
        onClick={onPlus}
        aria-label="Add 5 minutes"
      >
        +5m
      </Text>
    </HStack>
  )
}
