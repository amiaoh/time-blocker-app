import { useState } from 'react'
import { useUserId } from '@/hooks/useUserId'
import { usePresets, useAddPreset, useDeletePreset } from '@/components/presets/usePresets'
import { toaster } from '@/lib/toaster'
import { TOAST_DURATION_MS } from '@/constants'
import type { PresetList } from '@/types'

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function usePresetListScreen() {
  const userId = useUserId()
  const { data: presets = [], isLoading } = usePresets(userId)
  const addPreset = useAddPreset(userId)
  const deletePreset = useDeletePreset(userId)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingPreset, setDeletingPreset] = useState<PresetList | null>(null)

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

  function handleDeleteConfirm() {
    if (!deletingPreset) return
    deletePreset.mutate(deletingPreset.id, {
      onSuccess: () => {
        setDeletingPreset(null)
        toaster.create({ title: 'Preset deleted', type: 'info', duration: TOAST_DURATION_MS })
      },
      onError: (err) => toaster.create({ title: 'Failed to delete preset', description: errorMessage(err), type: 'error' }),
    })
  }

  return {
    presets,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    handleAddSubmit,
    isAddingPreset: addPreset.isPending,
    deletingPreset,
    setDeletingPreset,
    handleDeleteConfirm,
    isDeletingPreset: deletePreset.isPending,
  }
}
