import { HStack, Text } from '@chakra-ui/react'
import { PRIORITY_COLORS } from '@/types'
import type { TaskColor } from '@/types'

interface ColorPickerProps {
  value: TaskColor
  onChange: (color: TaskColor) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <HStack gap={2}>
      {PRIORITY_COLORS.map(({ color, label }) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={`${label} priority`}
          aria-pressed={value === color}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: 8,
            background: color,
            border: `2px solid ${value === color ? 'white' : 'transparent'}`,
            outline: value === color ? `2px solid ${color}` : 'none',
            outlineOffset: 2,
            cursor: 'pointer',
            transition: 'opacity 0.1s',
            opacity: value === color ? 1 : 0.6,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = value === color ? '1' : '0.6' }}
        >
          <Text fontSize="xs" fontWeight="semibold" color="white" textAlign="center">
            {label}
          </Text>
        </button>
      ))}
    </HStack>
  )
}
