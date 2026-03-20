import { type ReactNode } from 'react'
import { Box, Grid, GridItem, HStack } from '@chakra-ui/react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { DragHandle } from '@/components/ordering/DragHandle'

interface BaseTaskCardProps {
  id: string
  bg: string
  opacity?: number
  icon: ReactNode
  title: ReactNode
  duration?: ReactNode
  actions: ReactNode
  overlay?: ReactNode
  dragDisabled?: boolean
  pt?: number
  boxShadow?: string
  zIndex?: number | string
  className?: string
  role?: string
  ariaLabel?: string
}

export function BaseTaskCard({
  id, bg, opacity = 1, icon, title, duration, actions, overlay,
  dragDisabled, pt = 3, boxShadow, zIndex, className, role, ariaLabel,
}: BaseTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: dragDisabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : opacity,
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={bg}
      borderRadius="xl"
      position="relative"
      role={role}
      zIndex={zIndex}
      className={className}
      boxShadow={isDragging ? 'none' : (boxShadow ?? 'none')}
      transition="opacity 0.15s, box-shadow 0.2s ease"
      aria-label={ariaLabel}
    >
      {overlay}
      <HStack align="stretch" gap={0}>
        {!dragDisabled ? (
          <DragHandle {...attributes} {...listeners} />
        ) : (
          <Box w={8} flexShrink={0} />
        )}
        <Grid
          templateColumns="auto 1fr"
          templateRows="auto auto"
          columnGap={1}
          rowGap={0}
          flex={1}
          pb={3}
          pr={4}
          pl={0}
          pt={pt}
          minW={0}
          alignItems="center"
        >
          <GridItem display="flex" justifyContent="center">{icon}</GridItem>
          <GridItem minW={0}>{title}</GridItem>
          <GridItem display="flex" justifyContent="center">{duration}</GridItem>
          <GridItem minW={0}>{actions}</GridItem>
        </Grid>
      </HStack>
    </Box>
  )
}
