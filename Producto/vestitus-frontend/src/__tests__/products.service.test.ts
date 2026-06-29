import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('../services/api', () => {
  const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }
  return { default: mockAxios }
})

import api from '../services/api'
import { productService } from '../services/products.service'

const mockProducts = [
  { id: '1', name: 'Vestido Test', price: 45000, stock_quantity: 5, stock: 5, images: [] },
  { id: '2', name: 'Traje Test', price: 65000, stock_quantity: 3, stock: 3, images: [] },
]

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('returns mapped products', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockProducts } })

      const result = await productService.getAll()
      expect(result).toHaveLength(2)
      expect(result[0].stock).toBe(5)
      expect(api.get).toHaveBeenCalledWith('/products?')
    })

    it('passes filters as query params', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { data: [] } })

      await productService.getAll({ category: 'vestidos', type: 'rent' })

      expect(api.get).toHaveBeenCalledWith('/products?category=vestidos&type=arriendo')
    })
  })

  describe('getById', () => {
    it('returns a single mapped product', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockProducts[0] } })

      const result = await productService.getById('1')
      expect(result.id).toBe('1')
      expect(result.stock).toBe(5)
    })
  })

  describe('create', () => {
    it('maps stock to stock_quantity', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { data: { ...mockProducts[0], stock_quantity: 5 } } })

      const result = await productService.create({ name: 'New', price: 10000, stock: 5 } as any)
      expect(api.post).toHaveBeenCalledWith('/products', { name: 'New', price: 10000, stock_quantity: 5 })
      expect(result.stock).toBe(5)
    })
  })

  describe('update', () => {
    it('maps stock to stock_quantity', async () => {
      vi.mocked(api.put).mockResolvedValue({ data: { data: { ...mockProducts[0], stock_quantity: 10 } } })

      const result = await productService.update('1', { stock: 10 } as any)
      expect(api.put).toHaveBeenCalledWith('/products/1', { stock_quantity: 10 })
      expect(result.stock).toBe(10)
    })
  })

  describe('delete', () => {
    it('calls delete endpoint', async () => {
      vi.mocked(api.delete).mockResolvedValue({})

      await productService.delete('1')
      expect(api.delete).toHaveBeenCalledWith('/products/1')
    })
  })

  describe('uploadImage', () => {
    it('uploads with multipart/form-data', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      vi.mocked(api.post).mockResolvedValue({ data: { data: { url: 'https://cloudinary.com/img.jpg' } } })

      const result = await productService.uploadImage('1', file)
      expect(result.url).toBe('https://cloudinary.com/img.jpg')
      expect(api.post).toHaveBeenCalledWith(
        '/products/1/images',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
    })
  })
})
