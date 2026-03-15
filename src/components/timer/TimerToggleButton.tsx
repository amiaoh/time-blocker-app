import { Button } from '@chakra-ui/react'
import { Pause, Play } from 'lucide-react'

interface TimerToggleButtonProps {
  isRunning: boolean
  onClick: () => void
}

export function TimerToggleButton({ isRunning, onClick }: TimerToggleButtonProps) {
  return (
    <Button
      w={12}
      h={12}
      borderRadius="full"
      bg="gray.700"
      p={0}
      minW="auto"
      _hover={{ bg: 'gray.600' }}
      _active={{ bg: 'gray.500' }}
      onClick={onClick}
      aria-label={isRunning ? 'Pause timer' : 'Start timer'}
    >
      {isRunning ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
    </Button>
  )
}
