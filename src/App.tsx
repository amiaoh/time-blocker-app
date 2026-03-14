import { QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider, Toaster } from '@chakra-ui/react'
import { queryClient } from '@/lib/queryClient'
import { toaster } from '@/lib/toaster'
import { system } from '@/theme'
import { AppRouter } from '@/AppRouter'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AppRouter />
        <Toaster toaster={toaster}>
          {(toast) => {
            const accent =
              toast.type === 'success' ? '#4ade80'
              : toast.type === 'error' ? '#f87171'
              : '#93c5fd'
            return (
              <div
                key={toast.id}
                style={{
                  position: 'relative',
                  background: '#1e1e1e',
                  border: '1px solid #2e2e2e',
                  borderLeft: `4px solid ${accent}`,
                  borderRadius: '10px',
                  padding: '10px 36px 10px 14px',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.7)',
                  maxWidth: '300px',
                  marginBottom: '8px',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                <div style={{ color: '#f0f0f0', fontSize: '13px', fontWeight: 600, lineHeight: 1.4 }}>
                  {toast.title}
                </div>
                {toast.description && (
                  <div style={{ color: '#999', fontSize: '12px', marginTop: '3px', lineHeight: 1.3 }}>
                    {toast.description}
                  </div>
                )}
                <button
                  onClick={() => toaster.dismiss(toast.id)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#555',
                    cursor: 'pointer',
                    fontSize: '16px',
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            )
          }}
        </Toaster>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
