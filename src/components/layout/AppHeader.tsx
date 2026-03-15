import { HStack } from '@chakra-ui/react'

import { DaySummary } from '@/components/projection/DaySummary'
import type { ProjectionResult } from '@/types'
import { AddPresetBtn } from './AddPresetBtn'
import { MenuBtn } from './MenuBtn'

interface AppHeaderProps {
  projection: ProjectionResult
  use24HourTime: boolean
  onOpenSettings: () => void
  onOpenOverview: () => void
  onAddPreset?: () => void
}

export function AppHeader({ projection, use24HourTime, onOpenSettings, onOpenOverview, onAddPreset }: AppHeaderProps) {
  return (
    <HStack justify="space-between" align="center" mb={4} gap={3}>
      <MenuBtn onOpenSettings={onOpenSettings} onOpenOverview={onOpenOverview} />
      <DaySummary projection={projection} use24HourTime={use24HourTime} />
      <AddPresetBtn onClick={onAddPreset} />
    </HStack>
  )
}
