import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

const mockAuth = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  me: vi.fn().mockRejectedValue(new Error('no token')),
  logout: vi.fn(),
}))

const mockClient = vi.hoisted(() => ({
  getAll: vi.fn(),
  create: vi.fn(),
  getSelf: vi.fn(),
}))

vi.mock('../services/auth.service', () => ({
  authService: mockAuth,
}))

vi.mock('../services/clients.service', () => ({
  clientService: mockClient,
}))

import { AuthProvider } from '../contexts/AuthContext'
import { useAuth } from '../contexts/useAuth'
import type { AuthContextType } from '../contexts/AuthContextType'

function TestAuth() {
  const ctx = useAuth() as AuthContextType
  return (
    <div>
      <span data-testid="user">{JSON.stringify(ctx.user)}</span>
      <span data-testid="token">{ctx.token || 'null'}</span>
      <span data-testid="loading">{ctx.loading.toString()}</span>
      <span data-testid="isAdmin">{ctx.isAdmin.toString()}</span>
      <span data-testid="isEmployee">{ctx.isEmployee.toString()}</span>
      <button onClick={() => ctx.login('a@b.com', 'pass')}>Login</button>
      <button onClick={() => ctx.register('a@b.com', 'pass')}>Register</button>
      <button onClick={ctx.logout}>Logout</button>
    </div>
  )
}

function renderAuth() {
  return render(
    <AuthProvider>
      <TestAuth />
    </AuthProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Keep me() rejecting by default after clearAllMocks
    mockAuth.me.mockRejectedValue(new Error('no token'))
  })

  it('starts with no user and not loading when no saved token', () => {
    renderAuth()
    expect(screen.getByTestId('user').textContent).toBe('null')
    expect(screen.getByTestId('token').textContent).toBe('null')
    expect(screen.getByTestId('loading').textContent).toBe('false')
  })

  it('login sets user and token', async () => {
    const testUser = { id: '1', email: 'a@b.com', role: 'customer' }
    mockAuth.login.mockResolvedValue({ token: 'jwt-token', user: testUser })
    mockAuth.me.mockResolvedValue(testUser)

    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })

    expect(screen.getByTestId('token').textContent).toBe('jwt-token')
    expect(screen.getByTestId('user').textContent).toBe('{"id":"1","email":"a@b.com","role":"customer"}')
  })

  it('logout clears user and token', async () => {
    const testUser = { id: '1', email: 'a@b.com', role: 'customer' }
    mockAuth.login.mockResolvedValue({ token: 'existing-token', user: testUser })
    mockAuth.me.mockResolvedValue(testUser)
    mockAuth.logout.mockResolvedValue(undefined)

    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })

    expect(screen.getByTestId('token').textContent).toBe('existing-token')

    mockAuth.me.mockRejectedValue(new Error('logged out'))

    await act(async () => {
      fireEvent.click(screen.getByText('Logout'))
    })

    expect(screen.getByTestId('token').textContent).toBe('null')
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('shows admin role correctly', async () => {
    const adminUser = { id: '2', email: 'admin@test.com', role: 'admin' }
    mockAuth.login.mockResolvedValue({ token: 'admin-token', user: adminUser })
    mockAuth.me.mockResolvedValue(adminUser)

    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })

    expect(screen.getByTestId('isAdmin').textContent).toBe('true')
    expect(screen.getByTestId('isEmployee').textContent).toBe('true')
  })

  it('shows customer role correctly', async () => {
    const customerUser = { id: '3', email: 'customer@test.com', role: 'customer' }
    mockAuth.login.mockResolvedValue({ token: 'customer-token', user: customerUser })
    mockAuth.me.mockResolvedValue(customerUser)

    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })

    expect(screen.getByTestId('isAdmin').textContent).toBe('false')
    expect(screen.getByTestId('isEmployee').textContent).toBe('false')
  })
})
