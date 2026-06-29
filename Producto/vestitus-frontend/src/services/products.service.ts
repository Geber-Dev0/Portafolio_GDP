import api from './api'
import type { Product } from '../types'

export interface ProductFilters {
  category?: string
  type?: string
  available?: string
  collection?: string
}

const TYPE_MAP: Record<string, string> = {
  rent: 'arriendo',
  sale: 'venta',
  both: 'ambos',
}

function mapProduct(p: any): Product {
  return { ...p, stock: p.stock_quantity ?? 0 }
}

export const productService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams()
    if (filters?.category) params.set('category', filters.category)
    if (filters?.type) params.set('type', TYPE_MAP[filters.type] || filters.type)
    if (filters?.available) params.set('available', filters.available)
    const { data } = await api.get(`/products?${params}`)
    return (data.data ?? []).map(mapProduct)
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`)
    return mapProduct(data.data)
  },

  async create(product: Partial<Product>): Promise<Product> {
    const { stock, ...rest } = product
    const { data } = await api.post('/products', { ...rest, stock_quantity: stock })
    return mapProduct(data.data)
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { stock, ...rest } = product
    const { data } = await api.put(`/products/${id}`, { ...rest, stock_quantity: stock })
    return mapProduct(data.data)
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async uploadImage(productId: string, file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await api.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  async deleteImage(productId: string, imageId: string): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`)
  },
}
