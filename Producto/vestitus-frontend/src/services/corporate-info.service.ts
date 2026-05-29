import api from './api'
import type { CorporateInfo } from '../types'

export const corporateInfoService = {
  async get(): Promise<CorporateInfo> {
    const { data } = await api.get('/corporate-info')
    return data.data
  },

  async update(id: string, info: Partial<CorporateInfo>): Promise<CorporateInfo> {
    const { data } = await api.put(`/corporate-info/${id}`, info)
    return data.data
  },
}
