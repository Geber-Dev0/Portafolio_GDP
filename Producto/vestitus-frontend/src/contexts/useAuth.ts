import { useContext } from 'react'
import { AuthContext } from './AuthContextValue'
import type { AuthContextType } from './AuthContextType'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
