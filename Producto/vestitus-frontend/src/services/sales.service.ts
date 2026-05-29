import api from './api'
import type { Sale } from '../types'

export const salesService = {
  async getAll(): Promise<Sale[]> {
    const { data } = await api.get('/sales')
    return data.data
  },

  async getById(id: string): Promise<Sale> {
    const { data } = await api.get(`/sales/${id}`)
    return data.data
  },

  async create(sale: Partial<Sale>): Promise<Sale> {
    const { data } = await api.post('/sales', sale)
    return data.data
  },

  async update(id: string, sale: Partial<Sale>): Promise<Sale> {
    const { data } = await api.put(`/sales/${id}`, sale)
    return data.data
  },
}
