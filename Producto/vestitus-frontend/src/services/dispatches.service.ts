import api from './api'
import type { Dispatch } from '../types'

export const dispatchesService = {
  async getAll(): Promise<Dispatch[]> {
    const { data } = await api.get('/dispatches')
    return data.data
  },

  async getById(id: string): Promise<Dispatch> {
    const { data } = await api.get(`/dispatches/${id}`)
    return data.data
  },

  async create(dispatch: Partial<Dispatch>): Promise<Dispatch> {
    const { data } = await api.post('/dispatches', dispatch)
    return data.data
  },

  async update(id: string, dispatch: Partial<Dispatch>): Promise<Dispatch> {
    const { data } = await api.put(`/dispatches/${id}`, dispatch)
    return data.data
  },
}
