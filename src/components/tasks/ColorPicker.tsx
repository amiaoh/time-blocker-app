import { Grid } from '@chakra-ui/react'
import { TASK_COLORS } from '@/types'
import type { TaskColor } from '@/types'

interface ColorPickerProps {
  value: TaskColor
  onChange: (color: TaskColor) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Grid templateColumns="repeat(8, 1fr)" gap={2}>
      {TASK_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={`Select colour ${color}`}
          aria-pressed={value === color}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: color,
            border: `3px solid ${value === color ? 'white' : 'transparent'}`,
            outline: value === color ? `2px solid ${color}` : 'none',
            outlineOffset: 1,
            cursor: 'pointer',
            transition: 'transform 0.1s',
            padding: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.15)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        />
      ))}
    </Grid>
  )
}
