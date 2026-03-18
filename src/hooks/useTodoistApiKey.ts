import { useCallback, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

function storageKey(userId: string) {
  return `todoist_api_key_${userId}`
}

export function useTodoistApiKey() {
  const { user } = useAuth()
  const key = user ? storageKey(user.id) : null

  const [apiKey, setApiKeyState] = useState<string | null>(
    () => (key ? localStorage.getItem(key) : null),
  )

  const setApiKey = useCallback((value: string) => {
    if (!key) return
    localStorage.setItem(key, value)
    setApiKeyState(value)
  }, [key])

  const clearApiKey = useCallback(() => {
    if (!key) return
    localStorage.removeItem(key)
    setApiKeyState(null)
  }, [key])

  return { apiKey, setApiKey, clearApiKey }
}
