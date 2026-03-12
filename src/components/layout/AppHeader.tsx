import { HStack, Text } from '@chakra-ui/react'
import { DaySummary } from '@/components/projection/DaySummary'
import type { ProjectionResult } from '@/types'

interface AppHeaderProps {
  projection: ProjectionResult
  onOpenSettings: () => void
  onAddPreset?: () => void
}

export function AppHeader({ projection, onOpenSettings, onAddPreset }: AppHeaderProps) {
  return (
    <HStack justify="space-between" align="center" mb={4} gap={3}>
      {/* Settings */}
      <Text
        as="button"
        fontSize="lg"
        color="gray.500"
        _hover={{ color: 'gray.300' }}
        cursor="pointer"
        bg="transparent"
        border="none"
        p={1}
        flexShrink={0}
        onClick={onOpenSettings}
        aria-label="Open settings"
      >
        ⚙
      </Text>

      {/* Day summary — expands to fill remaining space */}
      <DaySummary projection={projection} />

      {/* Add preset list */}
      <Text
        as="button"
        fontSize="lg"
        color="gray.500"
        _hover={{ color: 'gray.300' }}
        cursor="pointer"
        bg="transparent"
        border="none"
        p={1}
        flexShrink={0}
        onClick={onAddPreset}
        aria-label="Add preset list"
        title="Add preset list"
      >
        ≡+
      </Text>
    </HStack>
  )
}
