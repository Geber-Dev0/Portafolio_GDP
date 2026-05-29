import api from './api'
import type { DamageType } from '../types'

export const damageTypesService = {
  async getAll(): Promise<DamageType[]> {
    const { data } = await api.get('/damage-types')
    return data.data
  },

  async create(dt: Partial<DamageType>): Promise<DamageType> {
    const { data } = await api.post('/damage-types', dt)
    return data.data
  },

  async update(id: string, dt: Partial<DamageType>): Promise<DamageType> {
    const { data } = await api.put(`/damage-types/${id}`, dt)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/damage-types/${id}`)
  },
}
