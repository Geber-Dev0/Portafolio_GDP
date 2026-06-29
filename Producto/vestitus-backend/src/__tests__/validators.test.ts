import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  loginSchema,
  productSchema,
  clientSchema,
  rentalSchema,
  saleSchema,
  availabilitySchema,
  returnSchema,
  dispatchSchema,
  corporateSchema,
} from '../validators/index'

describe('registerSchema', () => {
  it('accepts valid email and password', () => {
    const result = registerSchema.safeParse({ email: 'test@example.com', password: '12345678' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ email: 'not-an-email', password: '12345678' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = registerSchema.safeParse({ email: 'test@example.com', password: '123' })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid login', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'x' })
    expect(result.success).toBe(true)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('productSchema', () => {
  it('accepts valid product', () => {
    const result = productSchema.safeParse({ name: 'Test', price: 10000 })
    expect(result.success).toBe(true)
  })

  it('rejects negative price', () => {
    const result = productSchema.safeParse({ name: 'Test', price: -1 })
    expect(result.success).toBe(false)
  })

  it('accepts product with all optional fields', () => {
    const result = productSchema.safeParse({
      name: 'Vestido',
      description: 'Un vestido',
      category: 'vestidos',
      type: 'both',
      price: 45000,
      stock_quantity: 5,
      size: 'M',
      color: 'Rojo',
    })
    expect(result.success).toBe(true)
  })
})

describe('clientSchema', () => {
  it('accepts valid client', () => {
    const result = clientSchema.safeParse({ name: 'Juan Pérez' })
    expect(result.success).toBe(true)
  })

  it('accepts valid client_type values', () => {
    for (const ct of ['natural', 'empresa', 'agrupacion_cultural']) {
      const result = clientSchema.safeParse({ name: 'Test', client_type: ct })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid client_type', () => {
    const result = clientSchema.safeParse({ name: 'Test', client_type: 'invalid' })
    expect(result.success).toBe(false)
  })
})

describe('rentalSchema', () => {
  it('accepts valid rental', () => {
    const result = rentalSchema.safeParse({
      client_id: '550e8400-e29b-41d4-a716-446655440000',
      product_id: '550e8400-e29b-41d4-a716-446655440001',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
      period_type: 'days',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid period_type', () => {
    const result = rentalSchema.safeParse({
      client_id: '550e8400-e29b-41d4-a716-446655440000',
      product_id: '550e8400-e29b-41d4-a716-446655440001',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
      period_type: 'years',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-uuid client_id', () => {
    const result = rentalSchema.safeParse({
      client_id: 'not-a-uuid',
      product_id: '550e8400-e29b-41d4-a716-446655440001',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
      period_type: 'days',
    })
    expect(result.success).toBe(false)
  })
})

describe('saleSchema', () => {
  it('accepts valid sale', () => {
    const result = saleSchema.safeParse({
      client_id: '550e8400-e29b-41d4-a716-446655440000',
      product_id: '550e8400-e29b-41d4-a716-446655440001',
      sale_price: 50000,
    })
    expect(result.success).toBe(true)
  })

  it('accepts sale with quantity', () => {
    const result = saleSchema.safeParse({
      client_id: '550e8400-e29b-41d4-a716-446655440000',
      product_id: '550e8400-e29b-41d4-a716-446655440001',
      sale_price: 50000,
      quantity: 2,
    })
    expect(result.success).toBe(true)
  })

  it('rejects quantity 0', () => {
    const result = saleSchema.safeParse({
      client_id: '550e8400-e29b-41d4-a716-446655440000',
      product_id: '550e8400-e29b-41d4-a716-446655440001',
      sale_price: 50000,
      quantity: 0,
    })
    expect(result.success).toBe(false)
  })
})

describe('availabilitySchema', () => {
  it('accepts valid availability check', () => {
    const result = availabilitySchema.safeParse({
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing dates', () => {
    const result = availabilitySchema.safeParse({
      product_id: '550e8400-e29b-41d4-a716-446655440000',
    })
    expect(result.success).toBe(false)
  })
})

describe('returnSchema', () => {
  it('accepts valid return', () => {
    const result = returnSchema.safeParse({
      rental_id: '550e8400-e29b-41d4-a716-446655440000',
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid product_state values', () => {
    for (const state of ['good', 'damaged', 'lost']) {
      const result = returnSchema.safeParse({ rental_id: '550e8400-e29b-41d4-a716-446655440000', product_state: state })
      expect(result.success).toBe(true)
    }
  })
})

describe('dispatchSchema', () => {
  it('accepts valid dispatch', () => {
    const result = dispatchSchema.safeParse({ courier: 'Chilexpress' })
    expect(result.success).toBe(true)
  })
})

describe('corporateSchema', () => {
  it('accepts valid corporate info', () => {
    const result = corporateSchema.safeParse({ mission: 'Test', vision: 'Test', email: 'info@test.com' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = corporateSchema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})
