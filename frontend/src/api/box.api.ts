import api from '@/lib/axios'
import type { 
  BoxRequest, 
  BoxResponse, 
  BoxDetailResponse, 
  PaginatedResponse,
  BoxStockRequest
} from '@/types/box.types'

export const boxApi = {
  getBoxes: async (page = 1, pageSize = 10, name = '', location = ''): Promise<PaginatedResponse<BoxResponse>> => {
    const res = await api.get('/boxes', {
      params: { 
        page, 
        page_size: pageSize,
        name,
        location
      }
    })
    return res.data
  },

  getBoxById: async (id: string): Promise<BoxDetailResponse> => {
    const res = await api.get(`/boxes/${id}`)
    return res.data
  },

  createBox: async (data: BoxRequest): Promise<BoxResponse> => {
    const res = await api.post('/boxes', data)
    return res.data
  },

  updateBox: async (id: string, data: BoxRequest): Promise<BoxResponse> => {
    const res = await api.put(`/boxes/${id}`, data)
    return res.data
  },

  deleteBox: async (id: string): Promise<void> => {
    await api.delete(`/boxes/${id}`)
  },

  downloadBoxQR: async (id: string): Promise<void> => {
    const res = await api.get(`/boxes/${id}/qr`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `qr-caja-${id}.png`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  // Stock operations
  addBoxStock: async (boxId: string, data: BoxStockRequest): Promise<void> => {
    await api.post(`/boxes/${boxId}/stock/add`, data)
  },

  removeBoxStock: async (boxId: string, data: BoxStockRequest): Promise<void> => {
    await api.post(`/boxes/${boxId}/stock/remove`, data)
  },

  returnBoxStock: async (boxId: string, data: BoxStockRequest): Promise<void> => {
    await api.post(`/boxes/${boxId}/stock/return`, data)
  }
}
