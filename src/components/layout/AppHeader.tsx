import { Button, HStack } from '@chakra-ui/react'

import { DaySummary } from '@/components/projection/DaySummary'
import type { ProjectionResult } from '@/types'

interface AppHeaderProps {
  projection: ProjectionResult
  use24HourTime: boolean
  onOpenSettings: () => void
  onAddPreset?: () => void
}

export function AppHeader({ projection, use24HourTime, onOpenSettings, onAddPreset }: AppHeaderProps) {
  return (
    <HStack justify="space-between" align="center" mb={4} gap={3}>
      <Button
        variant="ghost"
        fontSize="lg"
        color="gray.500"
        _hover={{ color: 'gray.300', bg: 'transparent' }}
        p={1}
        h="auto"
        minW="auto"
        flexShrink={0}
        onClick={onOpenSettings}
        aria-label="Open settings"
      >
        ⚙
      </Button>

      <DaySummary projection={projection} use24HourTime={use24HourTime} />

      <Button
        variant="ghost"
        fontSize="lg"
        color="gray.500"
        _hover={{ color: 'gray.300', bg: 'transparent' }}
        p={1}
        h="auto"
        minW="auto"
        flexShrink={0}
        onClick={onAddPreset}
        aria-label="Add preset list"
        title="Add preset list"
      >
        ≡+
      </Button>
    </HStack>
  )
}
