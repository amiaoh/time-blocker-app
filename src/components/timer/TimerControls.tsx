import { Button, HStack } from '@chakra-ui/react'

interface TimerControlsProps {
  isRunning: boolean
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onComplete: () => void
  onSkip: () => void
  accentColor: string
}

export function TimerControls({
  isRunning,
  isPaused,
  onPause,
  onResume,
  onComplete,
  onSkip,
  accentColor,
}: TimerControlsProps) {
  return (
    <HStack justify="center" gap={3}>
      {isRunning && (
        <Button
          onClick={onPause}
          variant="outline"
          borderColor={accentColor}
          color={accentColor}
          _hover={{ bg: `${accentColor}22` }}
          size="sm"
        >
          Pause
        </Button>
      )}
      {isPaused && (
        <Button
          onClick={onResume}
          bg={accentColor}
          color="white"
          _hover={{ opacity: 0.85 }}
          size="sm"
        >
          Resume
        </Button>
      )}
      <Button
        onClick={onComplete}
        variant="ghost"
        color="green.400"
        _hover={{ bg: 'green.900' }}
        size="sm"
      >
        Done ✓
      </Button>
      <Button
        onClick={onSkip}
        variant="ghost"
        color="orange.400"
        _hover={{ bg: 'orange.900' }}
        size="sm"
      >
        Skip ⏭
      </Button>
    </HStack>
  )
}
