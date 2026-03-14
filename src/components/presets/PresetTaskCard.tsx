import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import type { PresetTask } from '@/types'
import { formatSeconds } from '@/utils/formatTime'
import { PresetTaskCardActions } from './PresetTaskCardActions'

interface PresetTaskCardProps {
  task: PresetTask
  isSelected: boolean
  onDelete: () => void
  onDuplicate: () => void
  onToggleSelect: () => void
}

export function PresetTaskCard({ task, isSelected, onDelete, onDuplicate, onToggleSelect }: PresetTaskCardProps) {
  return (
    <Box
      bg={task.color}
      borderRadius="xl"
      p={4}
      opacity={isSelected ? 1 : 0.45}
      transition="opacity 0.15s"
    >
      <HStack align="flex-start" gap={3}>
        <Text fontSize="2xl" lineHeight={1.2} flexShrink={0}>{task.icon}</Text>
        <Stack flex={1} gap={1} minW={0}>
          <HStack justify="space-between" align="flex-start">
            <Text fontWeight="bold" color="white" lineHeight={1.3} flex={1} mr={2}>
              {task.title}
            </Text>
            <Text color="whiteAlpha.800" fontSize="xl" lineHeight={1}>›</Text>
          </HStack>
          <HStack gap={3} align="center" flexWrap="wrap">
            <Text color="whiteAlpha.900" fontSize="sm" fontWeight="medium">
              {formatSeconds(task.durationMin * 60)}
            </Text>
            <PresetTaskCardActions
              isSelected={isSelected}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onToggleSelect={onToggleSelect}
            />
          </HStack>
        </Stack>
      </HStack>
    </Box>
  )
}
