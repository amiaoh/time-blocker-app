import { Box } from '@chakra-ui/react'
import type { HTMLAttributes } from 'react'

type DragHandleProps = HTMLAttributes<HTMLDivElement>

export function DragHandle(props: DragHandleProps) {
  return (
    <Box
      {...props}
      as="div"
      cursor="grab"
      color="whiteAlpha.600"
      borderLeftRadius="xl"
      _hover={{ bg: 'whiteAlpha.300', color: 'white' }}
      _active={{ cursor: 'grabbing' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w={8}
      flexShrink={0}
      alignSelf="stretch"
      fontSize="lg"
      aria-label="Drag to reorder"
    >
      ⠿
    </Box>
  )
}
