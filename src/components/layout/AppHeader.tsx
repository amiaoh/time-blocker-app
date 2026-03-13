import { Button, HStack, Text } from '@chakra-ui/react'

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
      {/* Settings */}
      
      {/* <Text
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
      </Text> */}
        <Button
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
      </Button>

      <DaySummary projection={projection} use24HourTime={use24HourTime} />

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
