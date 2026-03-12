import { Box, Grid } from '@chakra-ui/react'
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
        <Box
          key={color}
          as="button"
          type="button"
          w={7}
          h={7}
          borderRadius="full"
          bg={color}
          border="3px solid"
          borderColor={value === color ? 'white' : 'transparent'}
          outline={value === color ? `2px solid ${color}` : 'none'}
          outlineOffset="1px"
          cursor="pointer"
          transition="transform 0.1s"
          _hover={{ transform: 'scale(1.15)' }}
          onClick={() => onChange(color)}
          aria-label={`Select colour ${color}`}
          aria-pressed={value === color}
        />
      ))}
    </Grid>
  )
}
