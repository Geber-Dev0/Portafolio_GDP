import api from './api'
import type { Return } from '../types'

export const returnsService = {
  async getAll(): Promise<Return[]> {
    const { data } = await api.get('/returns')
    return data.data
  },

  async getById(id: string): Promise<Return> {
    const { data } = await api.get(`/returns/${id}`)
    return data.data
  },

  async create(ret: Partial<Return>): Promise<Return> {
    const { data } = await api.post('/returns', ret)
    return data.data
  },
}
