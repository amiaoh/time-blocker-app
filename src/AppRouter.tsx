import { useState } from 'react'
import { TimerScreen } from '@/screens/Timer/TimerScreen'
import { PresetListScreen } from '@/screens/PresetList/PresetListScreen'
import { PresetDetailScreen } from '@/screens/PresetDetail/PresetDetailScreen'
import type { PresetList } from '@/types'

type Screen =
  | { name: 'timer' }
  | { name: 'presets' }
  | { name: 'preset-detail'; preset: PresetList }

export function AppRouter() {
  const [screen, setScreen] = useState<Screen>({ name: 'timer' })

  if (screen.name === 'presets') {
    return (
      <PresetListScreen
        onBack={() => setScreen({ name: 'timer' })}
        onOpenPreset={(preset) => setScreen({ name: 'preset-detail', preset })}
      />
    )
  }

  if (screen.name === 'preset-detail') {
    return (
      <PresetDetailScreen
        preset={screen.preset}
        onBack={() => setScreen({ name: 'presets' })}
        onLoadSuccess={() => setScreen({ name: 'timer' })}
      />
    )
  }

  return (
    <TimerScreen onOpenPresets={() => setScreen({ name: 'presets' })} />
  )
}
