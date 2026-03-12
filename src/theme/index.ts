import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  globalCss: {
    body: {
      bg: 'gray.950',
      color: 'white',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#F5F3FF' },
          100: { value: '#EDE9FE' },
          200: { value: '#DDD6FE' },
          300: { value: '#C4B5FD' },
          400: { value: '#A78BFA' },
          500: { value: '#8B5CF6' },
          600: { value: '#7C3AED' },
          700: { value: '#6D28D9' },
          800: { value: '#5B21B6' },
          900: { value: '#4C1D95' },
        },
      },
      fonts: {
        body: { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' },
        heading: { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
