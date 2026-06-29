import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'

const mockSupabase = vi.hoisted(() => {
  const chain: any = {}
  chain.from = vi.fn(() => chain)
  chain.select = vi.fn(() => chain)
  chain.insert = vi.fn(() => chain)
  chain.update = vi.fn(() => chain)
  chain.delete = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.neq = vi.fn(() => chain)
  chain.order = vi.fn(() => chain)
  chain.in = vi.fn(() => chain)
  chain.lte = vi.fn(() => chain)
  chain.gte = vi.fn(() => chain)
  chain.limit = vi.fn(() => chain)
  chain.maybeSingle = vi.fn(() => Promise.resolve({ data: null, error: null }))
  chain.single = vi.fn(() => Promise.resolve({ data: null, error: null }))
  return chain
})

vi.mock('../database', () => ({ default: mockSupabase }))

vi.mock('../config/index', () => ({
  default: {
    jwtSecret: 'test-secret-key',
    port: 4000,
    supabaseUrl: 'https://test.supabase.co',
    supabaseKey: 'test-key',
    cloudinaryCloudName: 'test',
    cloudinaryApiKey: 'test',
    cloudinaryApiSecret: 'test',
    nodeEnv: 'test',
    corsOrigins: '*',
    swaggerAccessToken: '',
  },
}))

import { registerUser, authenticateUser, getUserById } from '../services/auth.service'

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registerUser', () => {
    it('registers a new user successfully', async () => {
      mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null })
      mockSupabase.single.mockResolvedValue({
        data: { id: 'user-1', email: 'test@test.com', role: 'customer' },
        error: null,
      })

      const result = await registerUser('Test@Test.com', 'password123')

      expect(result.user.email).toBe('test@test.com')
      expect(result.user.role).toBe('customer')
      expect(result.token).toBeDefined()
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
    })

    it('throws if user already exists', async () => {
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { id: 'existing' },
        error: null,
      })

      await expect(registerUser('existing@test.com', 'password123')).rejects.toThrow('Error al registrar usuario')
    })

    it('throws on supabase error', async () => {
      mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null })
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('DB error') })

      await expect(registerUser('fail@test.com', 'password123')).rejects.toThrow('Error al registrar usuario')
    })
  })

  describe('authenticateUser', () => {
    it('authenticates with valid credentials', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 12)
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { id: 'user-1', email: 'test@test.com', password_hash: passwordHash, role: 'customer' },
        error: null,
      })

      const result = await authenticateUser('test@test.com', 'correct-password')

      expect(result.user.email).toBe('test@test.com')
      expect(result.token).toBeDefined()
    })

    it('throws with wrong password', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 12)
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { id: 'user-1', email: 'test@test.com', password_hash: passwordHash, role: 'customer' },
        error: null,
      })

      await expect(authenticateUser('test@test.com', 'wrong-password')).rejects.toThrow('Credenciales inválidas')
    })

    it('throws if user not found', async () => {
      mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null })

      await expect(authenticateUser('noone@test.com', 'password')).rejects.toThrow('Credenciales inválidas')
    })
  })

  describe('getUserById', () => {
    it('returns user if found', async () => {
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { id: 'user-1', email: 'test@test.com', role: 'admin' },
        error: null,
      })

      const user = await getUserById('user-1')
      expect(user.email).toBe('test@test.com')
      expect(user.role).toBe('admin')
    })

    it('throws if user not found', async () => {
      mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null })

      await expect(getUserById('nonexistent')).rejects.toThrow('Usuario no encontrado')
    })
  })
})
