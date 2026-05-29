import api from './api'
import type { Client } from '../types'

export const clientService = {
  async getAll(): Promise<Client[]> {
    const { data } = await api.get('/clients')
    return data.data
  },

  async getById(id: string): Promise<Client> {
    const { data } = await api.get(`/clients/${id}`)
    return data.data
  },

  async create(client: Partial<Client>): Promise<Client> {
    const { data } = await api.post('/clients', client)
    return data.data
  },

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const { data } = await api.put(`/clients/${id}`, client)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/clients/${id}`)
  },
}
