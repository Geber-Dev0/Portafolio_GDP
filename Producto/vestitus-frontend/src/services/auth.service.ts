import api from './api'
import type { AuthResponse, User } from '../types'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', { email, password })
    return data.data
  },

  async register(email: string, password: string): Promise<User> {
    const { data } = await api.post('/auth/register', { email, password })
    return data.data
  },

  async me(): Promise<User> {
    const { data } = await api.get('/auth/me')
    return data.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },
}
