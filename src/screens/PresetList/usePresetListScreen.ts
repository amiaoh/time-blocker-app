import { useState } from 'react'
import { useSessionId } from '@/hooks/useSessionId'
import { usePresets, useAddPreset } from '@/components/presets/usePresets'
import { toaster } from '@/lib/toaster'
import { TOAST_DURATION_MS } from '@/constants'

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function usePresetListScreen() {
  const sessionId = useSessionId()
  const { data: presets = [], isLoading } = usePresets(sessionId)
  const addPreset = useAddPreset(sessionId)
  const [isFormOpen, setIsFormOpen] = useState(false)

  function handleAddSubmit({ name, icon }: { name: string; icon: string }) {
    addPreset.mutate(
      { name, icon },
      {
        onSuccess: () => {
          setIsFormOpen(false)
          toaster.create({ title: 'Preset created', type: 'success', duration: TOAST_DURATION_MS })
        },
        onError: (err) => toaster.create({ title: 'Failed to create preset', description: errorMessage(err), type: 'error' }),
      },
    )
  }

  return {
    presets,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    handleAddSubmit,
    isAddingPreset: addPreset.isPending,
  }
}
