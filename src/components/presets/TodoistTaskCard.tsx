import { Box, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import { BookmarkCheck, Copy } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import type { MappedTodoistTask } from '@/utils/todoistApi'
import { DragHandle } from '@/components/ordering/DragHandle'
import { ActionBtn } from '@/components/shared/ActionBtn'

interface TodoistTaskCardProps {
  task: MappedTodoistTask
  isSelected: boolean
  onToggleSelect: () => void
  onCopyToPreset?: () => void
}

export function TodoistTaskCard({ task, isSelected, onToggleSelect, onCopyToPreset }: TodoistTaskCardProps) {
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
        <Grid
          templateColumns="auto 1fr"
          templateRows="auto auto"
          columnGap={1}
          flex={1}
          pb={3}
          pr={4}
          pl={0}
          pt={3}
          minW={0}
          alignItems="center"
        >
          <GridItem display="flex" justifyContent="center">
            <Text fontSize="xl" lineHeight={1.2}>{task.icon}</Text>
          </GridItem>
          <GridItem minW={0}>
            <Text fontWeight="semibold" fontSize="md" color="white" lineClamp={2}>{task.title}</Text>
          </GridItem>
          <GridItem display="flex" justifyContent="center" alignItems="center" gap={1}>
            {task.durationFromPreset && <BookmarkCheck size={10} color="#A78BFA" />}
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color={task.durationFromPreset ? '#A78BFA' : 'white'}
              fontVariantNumeric="tabular-nums"
            >
              {task.durationMin}m
            </Text>
          </GridItem>
          <GridItem minW={0}>
            <HStack gap={1}>
              <ActionBtn
                label={isSelected ? 'Selected ✓' : 'Select'}
                onClick={onToggleSelect}
                color={isSelected ? 'white' : 'whiteAlpha.500'}
                hoverColor="white"
              />
              {onCopyToPreset && (
                <ActionBtn label="Copy to preset" onClick={onCopyToPreset} color="whiteAlpha.500" hoverColor="white">
                  <Copy size={12} />
                </ActionBtn>
              )}
            </HStack>
          </GridItem>
        </Grid>
      </HStack>
    </Box>
  )
}
