import { HStack } from '@chakra-ui/react'

import { DaySummary } from '@/components/projection/DaySummary'
import type { ProjectionResult } from '@/types'
import { AddPresetBtn } from './AddPresetBtn'
import { SettingsBtn } from './SettingsBtn'

interface AppHeaderProps {
  projection: ProjectionResult
  use24HourTime: boolean
  onOpenSettings: () => void
  onAddPreset?: () => void
}

export function AppHeader({ projection, use24HourTime, onOpenSettings, onAddPreset }: AppHeaderProps) {
  return (
    <HStack justify="space-between" align="center" mb={4} gap={3}>
      <SettingsBtn onClick={onOpenSettings} />
      <DaySummary projection={projection} use24HourTime={use24HourTime} />
      <AddPresetBtn onClick={onAddPreset} />
    </HStack>
  )
}
