import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validate } from '../middleware/validate.middleware'
import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'

const testSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  age: z.number().min(18, 'Debe ser mayor de edad'),
})

function mockReqRes() {
  const req = { body: {} } as Request
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response
  const next = vi.fn() as NextFunction
  return { req, res, next }
}

describe('validate middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls next() if body is valid', () => {
    const { req, res, next } = mockReqRes()
    req.body = { name: 'Juan', age: 25 }
    const middleware = validate(testSchema)
    middleware(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('returns 400 if body is invalid', () => {
    const { req, res, next } = mockReqRes()
    req.body = { name: '', age: 15 }
    const middleware = validate(testSchema)
    middleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Datos inválidos',
      errors: expect.arrayContaining([
        expect.objectContaining({ field: 'name' }),
        expect.objectContaining({ field: 'age' }),
      ]),
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('validates query params when source is query', () => {
    const { req, res, next } = mockReqRes()
    const querySchema = z.object({ page: z.coerce.number().min(1) })
    req.query = { page: 'abc' } as any
    const middleware = validate(querySchema, 'query')
    middleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('mutates req.body with parsed data', () => {
    const { req, res, next } = mockReqRes()
    req.body = { name: '  Juan  ', age: 25 }
    const middleware = validate(z.object({
      name: z.string().transform(s => s.trim()),
      age: z.number(),
    }))
    middleware(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.body.name).toBe('Juan')
  })
})
