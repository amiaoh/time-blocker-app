import { Box, Text } from '@chakra-ui/react'

interface TimerToggleButtonProps {
  isRunning: boolean
  onClick: () => void
}

export function TimerToggleButton({ isRunning, onClick }: TimerToggleButtonProps) {
  return (
    <Box
      as="button"
      w={12}
      h={12}
      borderRadius="full"
      bg="gray.700"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      _hover={{ bg: 'gray.600' }}
      onClick={onClick}
      aria-label={isRunning ? 'Pause timer' : 'Start timer'}
    >
      <Text fontSize="lg" aria-hidden="true">
        {isRunning ? '⏸' : '▶'}
      </Text>
    </Box>
  )
}
