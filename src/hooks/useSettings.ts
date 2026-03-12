import { useState } from 'react'

export interface AppSettings {
  maxTaskDurationMin: number
  showPieTimer: boolean
}

const DEFAULTS: AppSettings = {
  maxTaskDurationMin: 120,
  showPieTimer: true,
}

const STORAGE_KEY = 'time-blocker-settings'

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  function updateSettings(updates: Partial<AppSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return { settings, updateSettings }
}
