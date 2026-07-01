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

vi.mock('../services/product.service', () => ({
  adjustStock: vi.fn().mockResolvedValue({ stock_quantity: 4 }),
  checkAvailabilityByDateRange: vi.fn().mockResolvedValue({ available: true }),
}))

import { adjustStock, checkAvailabilityByDateRange } from '../services/product.service'
import {
  findRentals,
  findRentalsByClientId,
  findRentalById,
  createRental,
  updateRental,
  deleteRental,
} from '../services/rental.service'

describe('rental.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findRentals', () => {
    it('returns all rentals with joins', async () => {
      const rentals = [{ id: 'r1', client_id: 'c1' }]
      mockSupabase.order.mockResolvedValue({ data: rentals, error: null })

      const result = await findRentals()
      expect(result).toEqual(rentals)
      expect(mockSupabase.select).toHaveBeenCalledWith('*, clients(*), products(*, product_images(*))')
    })
  })

  describe('findRentalsByClientId', () => {
    it('filters by client_id', async () => {
      mockSupabase.order.mockResolvedValue({ data: [], error: null })

      await findRentalsByClientId('c1')
      expect(mockSupabase.eq).toHaveBeenCalledWith('client_id', 'c1')
    })
  })

  describe('findRentalById', () => {
    it('returns rental by ID', async () => {
      const rental = { id: 'r1' }
      mockSupabase.single.mockResolvedValue({ data: rental, error: null })

      const result = await findRentalById('r1')
      expect(result.id).toBe('r1')
    })
  })

  describe('createRental', () => {
    const validPayload = {
      client_id: 'c1',
      product_id: 'p1',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
      period_type: 'days' as const,
    }

    it('creates rental successfully', async () => {
      mockSupabase.single
        .mockResolvedValueOnce({ data: { id: 'p1', price: 10000, stock_quantity: 5 }, error: null })
        .mockResolvedValueOnce({
          data: {
            id: 'r1',
            client_id: 'c1',
            product_id: 'p1',
            rental_price: 40000,
            status: 'active',
          },
          error: null,
        })

      const result = await createRental(validPayload)
      expect(result.id).toBe('r1')
      expect(result.calculated_price).toBe(40000)
      expect(adjustStock).toHaveBeenCalledWith('p1', -1)
    })

    it('throws when product not found', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: null })

      await expect(createRental(validPayload)).rejects.toThrow('Producto no encontrado')
    })

    it('throws when stock is insufficient', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: { id: 'p1', price: 10000, stock_quantity: 0 }, error: null })

      await expect(createRental(validPayload)).rejects.toThrow('Stock insuficiente')
    })

    it('throws when product is not available', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: { id: 'p1', price: 10000, stock_quantity: 5 }, error: null })
      vi.mocked(checkAvailabilityByDateRange).mockResolvedValueOnce({ available: false, reason: 'Producto reservado' })

      await expect(createRental(validPayload)).rejects.toThrow('Producto reservado')
    })
  })

  describe('updateRental', () => {
    it('updates rental fields', async () => {
      mockSupabase.single.mockResolvedValue({ data: { id: 'r1', status: 'completed' }, error: null })

      const result = await updateRental('r1', { status: 'completed' })
      expect(result.status).toBe('completed')
    })
  })

  describe('deleteRental', () => {
    it('deletes rental and restores stock', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: { product_id: 'p1' }, error: null })

      const result = await deleteRental('r1')
      expect(result.id).toBe('r1')
      expect(adjustStock).toHaveBeenCalledWith('p1', 1)
    })

    it('throws when rental not found', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: new Error('Not found') })

      await expect(deleteRental('bad-id')).rejects.toThrow('Arriendo no encontrado')
    })
  })
})
