import type { User } from '../types'

export interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  clientId: string | null
  login: (email: string, password: string) => Promise<User>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
  isEmployee: boolean
}
