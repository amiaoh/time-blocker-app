import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'tbapp_session_id'

function getOrCreateSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const newId = uuidv4()
  localStorage.setItem(SESSION_KEY, newId)
  return newId
}

export function useSessionId(): string {
  const [sessionId] = useState<string>(getOrCreateSessionId)
  return sessionId
}
