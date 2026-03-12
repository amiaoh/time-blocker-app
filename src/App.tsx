import { QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { queryClient } from '@/lib/queryClient'
import { system } from '@/theme'
import { TimerScreen } from '@/screens/Timer/TimerScreen'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <TimerScreen />
      </ChakraProvider>
    </QueryClientProvider>
  )
}
