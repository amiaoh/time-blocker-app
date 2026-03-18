import { useState } from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { useAuth } from '@/context/AuthContext'
import { AuthScreen } from '@/screens/Auth/AuthScreen'
import { TimerScreen } from '@/screens/Timer/TimerScreen'
import { PresetListScreen } from '@/screens/PresetList/PresetListScreen'
import { PresetDetailScreen } from '@/screens/PresetDetail/PresetDetailScreen'
import { TodoistPresetScreen } from '@/screens/TodoistPreset/TodoistPresetScreen'
import { OverviewScreen } from '@/screens/Overview/OverviewScreen'
import type { PresetList } from '@/types'

type Screen =
  | { name: 'timer' }
  | { name: 'overview' }
  | { name: 'presets' }
  | { name: 'preset-detail'; preset: PresetList }
  | { name: 'todoist-preset' }

export function AppRouter() {
  const { user } = useAuth()
  const [screen, setScreen] = useState<Screen>({ name: 'timer' })

  if (user === undefined) {
    return (
      <Box minH="100vh" bg="gray.950" display="flex" alignItems="center" justifyContent="center">
        <Spinner color="brand.400" size="lg" />
      </Box>
    )
  }

  if (user === null) {
    return <AuthScreen />
  }

  if (screen.name === 'overview') {
    return <OverviewScreen onBack={() => setScreen({ name: 'timer' })} />
  }

  if (screen.name === 'presets') {
    return (
      <PresetListScreen
        onBack={() => setScreen({ name: 'timer' })}
        onOpenPreset={(preset) => setScreen({ name: 'preset-detail', preset })}
        onOpenTodoist={() => setScreen({ name: 'todoist-preset' })}
      />
    )
  }

  if (screen.name === 'preset-detail') {
    return (
      <PresetDetailScreen
        preset={screen.preset}
        onBack={() => setScreen({ name: 'presets' })}
        onLoadSuccess={() => setScreen({ name: 'timer' })}
        onRename={(updated) => setScreen({ name: 'preset-detail', preset: updated })}
      />
    )
  }

  if (screen.name === 'todoist-preset') {
    return (
      <TodoistPresetScreen
        onBack={() => setScreen({ name: 'presets' })}
        onLoadSuccess={() => setScreen({ name: 'timer' })}
      />
    )
  }

  return (
    <TimerScreen
      onOpenPresets={() => setScreen({ name: 'presets' })}
      onOpenOverview={() => setScreen({ name: 'overview' })}
    />
  )
}
