import { describe, it, expect, vi, beforeEach } from 'vitest'

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

import {
  findProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  checkAvailabilityByDateRange,
} from '../services/product.service'

describe('product.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findProducts', () => {
    it('returns all products without filters', async () => {
      const products = [{ id: '1', name: 'Test', price: 10000 }]
      mockSupabase.order.mockResolvedValue({ data: products, error: null })

      const result = await findProducts()
      expect(result).toEqual(products)
    })

    it('applies category filter', async () => {
      mockSupabase.order.mockResolvedValue({ data: [], error: null })

      await findProducts({ category: 'vestidos' })

      expect(mockSupabase.eq).toHaveBeenCalledWith('category', 'vestidos')
    })

    it('applies type filter', async () => {
      mockSupabase.order.mockResolvedValue({ data: [], error: null })

      await findProducts({ type: 'rent' })

      expect(mockSupabase.eq).toHaveBeenCalledWith('type', 'rent')
    })

    it('applies availability filter', async () => {
      mockSupabase.order.mockResolvedValue({ data: [], error: null })

      await findProducts({ is_available: true })

      expect(mockSupabase.eq).toHaveBeenCalledWith('is_available', true)
    })
  })

  describe('findProductById', () => {
    it('returns product by id', async () => {
      const product = { id: '1', name: 'Test', product_images: [] }
      mockSupabase.single.mockResolvedValue({ data: product, error: null })

      const result = await findProductById('1')
      expect(result.id).toBe('1')
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1')
    })

    it('throws on error', async () => {
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Not found') })

      await expect(findProductById('bad-id')).rejects.toThrow()
    })
  })

  describe('createProduct', () => {
    it('creates a product', async () => {
      const payload = { name: 'New', price: 50000 }
      mockSupabase.single.mockResolvedValue({ data: { id: 'new-1', ...payload, stock_quantity: 0 }, error: null })

      const result = await createProduct(payload)
      expect(result.name).toBe('New')
    })
  })

  describe('updateProduct', () => {
    it('updates a product', async () => {
      mockSupabase.single.mockResolvedValue({ data: { id: '1', name: 'Updated', price: 60000 }, error: null })

      const result = await updateProduct('1', { price: 60000 })
      expect(result.price).toBe(60000)
    })
  })

  describe('deleteProduct', () => {
    it('deletes a product', async () => {
      const result = await deleteProduct('1')
      expect(result.id).toBe('1')
    })
  })

  describe('adjustStock', () => {
    it('increases stock', async () => {
      mockSupabase.single
        .mockResolvedValueOnce({ data: { stock_quantity: 5 }, error: null })
        .mockResolvedValueOnce({ data: { stock_quantity: 8 }, error: null })

      const result = await adjustStock('1', 3)
      expect(result.stock_quantity).toBe(8)
    })

    it('decreases stock', async () => {
      mockSupabase.single
        .mockResolvedValueOnce({ data: { stock_quantity: 5 }, error: null })
        .mockResolvedValueOnce({ data: { stock_quantity: 4 }, error: null })

      const result = await adjustStock('1', -1)
      expect(result.stock_quantity).toBe(4)
    })

    it('throws when stock would go negative', async () => {
      mockSupabase.single.mockResolvedValue({ data: { stock_quantity: 1 }, error: null })

      await expect(adjustStock('1', -5)).rejects.toThrow('Stock insuficiente')
    })

    it('throws if product not found', async () => {
      mockSupabase.single.mockResolvedValue({ data: null, error: null })

      await expect(adjustStock('bad-id', 1)).rejects.toThrow('Producto no encontrado')
    })
  })

  describe('checkAvailabilityByDateRange', () => {
    it('returns available when no conflicts', async () => {
      mockSupabase.single
        .mockResolvedValueOnce({ data: { stock_quantity: 5, is_available: true }, error: null })
      mockSupabase.gte.mockResolvedValue({ data: [], error: null })

      const result = await checkAvailabilityByDateRange('1', '2026-06-01', '2026-06-05')
      expect(result.available).toBe(true)
    })

    it('returns unavailable when product is not available', async () => {
      mockSupabase.single.mockResolvedValue({ data: { stock_quantity: 5, is_available: false }, error: null })

      const result = await checkAvailabilityByDateRange('1', '2026-06-01', '2026-06-05')
      expect(result.available).toBe(false)
      expect(result.reason).toBe('Producto no disponible')
    })

    it('returns unavailable when out of stock', async () => {
      mockSupabase.single.mockResolvedValue({ data: { stock_quantity: 0, is_available: true }, error: null })

      const result = await checkAvailabilityByDateRange('1', '2026-06-01', '2026-06-05')
      expect(result.available).toBe(false)
      expect(result.reason).toBe('Sin stock')
    })

    it('returns unavailable when dates overlap', async () => {
      mockSupabase.single.mockResolvedValue({ data: { stock_quantity: 5, is_available: true }, error: null })
      mockSupabase.gte.mockResolvedValue({
        data: [{ id: 'r1', start_date: '2026-06-01', end_date: '2026-06-10' }],
        error: null,
      })

      const result = await checkAvailabilityByDateRange('1', '2026-06-05', '2026-06-15')
      expect(result.available).toBe(false)
    })
  })
})
