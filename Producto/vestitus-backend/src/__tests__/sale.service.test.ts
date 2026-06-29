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
}))

import { adjustStock } from '../services/product.service'
import {
  findSales,
  findSalesByClientId,
  findSaleById,
  createSale,
  updateSale,
} from '../services/sale.service'

describe('sale.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findSales', () => {
    it('returns all sales', async () => {
      const sales = [{ id: 's1', sale_price: 50000 }]
      mockSupabase.order.mockResolvedValue({ data: sales, error: null })

      const result = await findSales()
      expect(result).toEqual(sales)
    })
  })

  describe('findSalesByClientId', () => {
    it('filters by client_id', async () => {
      mockSupabase.order.mockResolvedValue({ data: [], error: null })

      await findSalesByClientId('c1')
      expect(mockSupabase.eq).toHaveBeenCalledWith('client_id', 'c1')
    })
  })

  describe('findSaleById', () => {
    it('returns sale by ID', async () => {
      mockSupabase.single.mockResolvedValue({ data: { id: 's1' }, error: null })
      const result = await findSaleById('s1')
      expect(result.id).toBe('s1')
    })
  })

  describe('createSale', () => {
    const validPayload = {
      client_id: 'c1',
      product_id: 'p1',
      sale_price: 50000,
    }

    it('creates sale successfully', async () => {
      mockSupabase.single
        .mockResolvedValueOnce({ data: { id: 'p1', stock_quantity: 5 }, error: null })
        .mockResolvedValueOnce({
          data: { id: 's1', client_id: 'c1', sale_price: 50000, quantity: 1, status: 'completed' },
          error: null,
        })

      const result = await createSale(validPayload)
      expect(result.id).toBe('s1')
      expect(adjustStock).toHaveBeenCalledWith('p1', -1)
    })

    it('creates sale with custom quantity', async () => {
      mockSupabase.single
        .mockResolvedValueOnce({ data: { id: 'p1', stock_quantity: 10 }, error: null })
        .mockResolvedValueOnce({
          data: { id: 's2', quantity: 3 },
          error: null,
        })

      await createSale({ ...validPayload, quantity: 3 })
      expect(adjustStock).toHaveBeenCalledWith('p1', -3)
    })

    it('throws when product not found', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: null })

      await expect(createSale(validPayload)).rejects.toThrow('Producto no encontrado')
    })

    it('throws when stock is insufficient', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: { id: 'p1', stock_quantity: 1 }, error: null })

      await expect(createSale({ ...validPayload, quantity: 5 })).rejects.toThrow('Stock insuficiente')
    })
  })

  describe('updateSale', () => {
    it('updates sale fields', async () => {
      mockSupabase.single.mockResolvedValue({ data: { id: 's1', payment_status: 'paid' }, error: null })

      const result = await updateSale('s1', { payment_status: 'paid' })
      expect(result.payment_status).toBe('paid')
    })
  })
})
