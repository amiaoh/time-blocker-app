import { useState } from 'react'
import { DEFAULT_MAX_TASK_DURATION_MIN } from '@/constants'

export interface AppSettings {
  maxTaskDurationMin: number
  showPieTimer: boolean
  use24HourTime: boolean
}

const DEFAULTS: AppSettings = {
  maxTaskDurationMin: DEFAULT_MAX_TASK_DURATION_MIN,
  showPieTimer: true,
  use24HourTime: false,
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
