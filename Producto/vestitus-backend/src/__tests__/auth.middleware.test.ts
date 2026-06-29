import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { authenticate, authorize } from '../middleware/auth.middleware'
import type { Request, Response, NextFunction } from 'express'

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

function mockReqRes() {
  const req = { headers: {}, user: undefined } as unknown as Request
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response
  const next = vi.fn() as NextFunction
  return { req, res, next }
}

describe('authenticate middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 if no auth header', () => {
    const { req, res, next } = mockReqRes()
    authenticate(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Token requerido' })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 if header does not start with Bearer', () => {
    const { req, res, next } = mockReqRes()
    req.headers.authorization = 'Token abc123'
    authenticate(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('returns 401 if token is invalid', () => {
    const { req, res, next } = mockReqRes()
    req.headers.authorization = 'Bearer invalid-token'
    authenticate(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Token inválido o expirado' })
  })

  it('calls next() if token is valid', () => {
    const token = jwt.sign(
      { userId: '123', email: 'test@test.com', role: 'customer' },
      'test-secret-key'
    )
    const { req, res, next } = mockReqRes()
    req.headers.authorization = `Bearer ${token}`
    authenticate(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.user).toBeDefined()
    expect(req.user!.email).toBe('test@test.com')
  })
})

describe('authorize middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 if no user on request', () => {
    const { req, res, next } = mockReqRes()
    const middleware = authorize('admin')
    middleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('returns 403 if user role is not allowed', () => {
    const { req, res, next } = mockReqRes()
    req.user = { userId: '123', email: 'test@test.com', role: 'customer' }
    const middleware = authorize('admin')
    middleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('calls next() if user role is allowed', () => {
    const { req, res, next } = mockReqRes()
    req.user = { userId: '123', email: 'test@test.com', role: 'admin' }
    const middleware = authorize('admin', 'employee')
    middleware(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('allows multiple roles', () => {
    const { req, res, next } = mockReqRes()
    req.user = { userId: '123', email: 'test@test.com', role: 'employee' }
    const middleware = authorize('admin', 'employee')
    middleware(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
