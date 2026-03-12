import { Box } from '@chakra-ui/react'
import type { HTMLAttributes } from 'react'

type DragHandleProps = HTMLAttributes<HTMLDivElement>

export function DragHandle(props: DragHandleProps) {
  return (
    <Box
      {...props}
      as="div"
      cursor="grab"
      color="gray.600"
      _hover={{ color: 'gray.400' }}
      _active={{ cursor: 'grabbing' }}
      display="flex"
      alignItems="center"
      px={1}
      aria-label="Drag to reorder"
      flexShrink={0}
    >
      ⠿
    </Box>
  )
}
