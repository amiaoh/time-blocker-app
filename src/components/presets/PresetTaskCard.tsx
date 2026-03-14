import { Box, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

import type { PresetTask } from '@/types'
import { DragHandle } from '@/components/ordering/DragHandle'
import { PresetTaskCardActions } from './PresetTaskCardActions'
import { formatSeconds } from '@/utils/formatTime'

interface PresetTaskCardProps {
  task: PresetTask
  isSelected: boolean
  onDelete: () => void
  onDuplicate: () => void
  onToggleSelect: () => void
}

export function PresetTaskCard({ task, isSelected, onDelete, onDuplicate, onToggleSelect }: PresetTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={task.color}
      borderRadius="xl"
      opacity={isSelected ? 1 : 0.45}
      transition="opacity 0.15s"
    >
      <HStack align="stretch" gap={0}>
        <DragHandle {...attributes} {...listeners} />

        {/* 2×2 grid: [emoji][title] / [duration][actions] */}
        <Grid
          templateColumns="auto 1fr"
          templateRows="auto auto"
          columnGap={3}
          rowGap={0}
          flex={1}
          pb={3}
          pr={4}
          pl={2}
          pt={3}
          minW={0}
          alignItems="center"
        >
          {/* Row 1 left: emoji */}
          <GridItem display="flex" justifyContent="center">
            <Text fontSize="xl" lineHeight={1.2}>{task.icon}</Text>
          </GridItem>

          {/* Row 1 right: title */}
          <GridItem minW={0}>
            <Text fontWeight="semibold" fontSize="md" color="white" truncate>
              {task.title}
            </Text>
          </GridItem>

          {/* Row 2 left: duration */}
          <GridItem display="flex" justifyContent="center">
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="white"
              fontVariantNumeric="tabular-nums"
            >
              {formatSeconds(task.durationMin * 60)}
            </Text>
          </GridItem>

          {/* Row 2 right: actions */}
          <GridItem minW={0}>
            <PresetTaskCardActions
              isSelected={isSelected}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onToggleSelect={onToggleSelect}
            />
          </GridItem>
        </Grid>
      </HStack>
    </Box>
  )
}
