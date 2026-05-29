import api from './api'
import type { Rental } from '../types'

export const rentalService = {
  async getAll(): Promise<Rental[]> {
    const { data } = await api.get('/rentals')
    return data.data
  },

  async getById(id: string): Promise<Rental> {
    const { data } = await api.get(`/rentals/${id}`)
    return data.data
  },

  async create(rental: Partial<Rental>): Promise<Rental> {
    const { data } = await api.post('/rentals', rental)
    return data.data
  },

  async update(id: string, rental: Partial<Rental>): Promise<Rental> {
    const { data } = await api.put(`/rentals/${id}`, rental)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/rentals/${id}`)
  },

  async checkAvailability(productId: string, startDate: string, endDate: string) {
    const { data } = await api.post('/check-availability', {
      product_id: productId,
      start_date: startDate,
      end_date: endDate,
    })
    return data.data
  },
}
