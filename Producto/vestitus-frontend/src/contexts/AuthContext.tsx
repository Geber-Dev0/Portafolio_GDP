import { useState, useEffect, startTransition, type ReactNode } from 'react'
import { authService } from '../services/auth.service'
import type { User } from '../types'
import { AuthContext } from './AuthContextValue'
import type { AuthContextType } from './AuthContextType'

export type { AuthContextType }

export function AuthProvider({ children }: { children: ReactNode }) {
  const savedToken = localStorage.getItem('token')
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(savedToken)
  const [loading, setLoading] = useState(() => !!savedToken)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    startTransition(() => {
      authService.me()
        .then((res) => { if (!cancelled) setUser(res) })
        .catch(() => {
          if (!cancelled) {
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
          }
        })
        .finally(() => { if (!cancelled) setLoading(false) })
    })
    return () => { cancelled = true }
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password)
    localStorage.setItem('token', res.token)
    setToken(res.token)
    setUser(res.user)
    return res.user
  }

  const register = async (email: string, password: string) => {
    await authService.register(email, password)
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isEmployee: user?.role === 'admin' || user?.role === 'employee',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
