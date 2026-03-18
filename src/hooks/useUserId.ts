import { useAuth } from '@/context/AuthContext'

export function useUserId(): string {
  const { user } = useAuth()
  if (!user) throw new Error('useUserId called without authenticated user')
  return user.id
}
