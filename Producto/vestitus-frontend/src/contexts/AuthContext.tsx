import { useState, useEffect, startTransition, useCallback, type ReactNode } from 'react'
import { authService } from '../services/auth.service'
import { clientService } from '../services/clients.service'
import type { User } from '../types'
import { AuthContext } from './AuthContextValue'
import type { AuthContextType } from './AuthContextType'

export type { AuthContextType }

const CLIENT_ID_KEY = 'vestitus_client_id'

export function AuthProvider({ children }: { children: ReactNode }) {
  const savedToken = localStorage.getItem('token')
  const savedClientId = localStorage.getItem(CLIENT_ID_KEY)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(savedToken)
  const [loading, setLoading] = useState(() => !!savedToken)
  const [clientId, setClientId] = useState<string | null>(savedClientId)

  const saveClientId = useCallback((id: string | null) => {
    setClientId(id)
    if (id) localStorage.setItem(CLIENT_ID_KEY, id)
    else localStorage.removeItem(CLIENT_ID_KEY)
  }, [])

  const findClientId = useCallback(async (role?: string) => {
    if (localStorage.getItem(CLIENT_ID_KEY)) return
    const email = user?.email
    if (!email) return
    let foundId: string | null = null
    try {
      if (role === 'admin' || role === 'employee') {
        const clients = await clientService.getAll()
        const match = clients.find(c => c.email === email)
        if (match) foundId = match.id
      } else {
        try {
          const client = await clientService.getSelf()
          if (client?.id) foundId = client.id
        } catch {}
      }
    } catch {}
    if (foundId) { saveClientId(foundId); return }
    // No client record exists — create one automatically
    try {
      const name = email.split('@')[0]
      const created = await clientService.create({ name, email, client_type: 'natural' })
      if (created?.id) saveClientId(created.id)
    } catch {}
  }, [saveClientId, user?.email])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    startTransition(() => {
      authService.me()
        .then((res) => {
          if (!cancelled) {
            setUser(res)
            findClientId(res.role)
          }
        })
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
  }, [token, findClientId])

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password)
    localStorage.setItem('token', res.token)
    setToken(res.token)
    setUser(res.user)
    findClientId(res.user.role)
    return res.user
  }

  const register = async (email: string, password: string) => {
    const res = await authService.register(email, password)
    localStorage.setItem('token', res.token)
    setToken(res.token)
    setUser(res.user)
    const name = email.split('@')[0]
    const client = await clientService.create({ name, email, client_type: 'natural' })
    if (client?.id) saveClientId(client.id)
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem(CLIENT_ID_KEY)
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        clientId,
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
