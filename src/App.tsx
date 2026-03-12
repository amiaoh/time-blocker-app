import { QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider, Toast, Toaster } from '@chakra-ui/react'
import { queryClient } from '@/lib/queryClient'
import { toaster } from '@/lib/toaster'
import { system } from '@/theme'
import { TimerScreen } from '@/screens/Timer/TimerScreen'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <TimerScreen />
        <Toaster toaster={toaster}>
          {(toast) => (
            <Toast.Root key={toast.id}>
              <Toast.Title>{toast.title}</Toast.Title>
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
              <Toast.CloseTrigger />
            </Toast.Root>
          )}
        </Toaster>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
