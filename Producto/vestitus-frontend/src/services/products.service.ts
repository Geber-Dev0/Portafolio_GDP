import api from './api'
import type { Product } from '../types'

export interface ProductFilters {
  category?: string
  type?: string
  available?: string
}

export const productService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams()
    if (filters?.category) params.set('category', filters.category)
    if (filters?.type) params.set('type', filters.type)
    if (filters?.available) params.set('available', filters.available)
    const { data } = await api.get(`/products?${params}`)
    return data.data
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`)
    return data.data
  },

  async create(product: Partial<Product>): Promise<Product> {
    const { data } = await api.post('/products', product)
    return data.data
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { data } = await api.put(`/products/${id}`, product)
    return data.data
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
}
