import axios from 'axios'
import { Menu, CreateMenuRequest, UpdateMenuRequest, MoveMenuRequest, ReorderMenusRequest } from '@/types/menu'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const menuApi = {
  // Get all menus (flat list)
  getAll: async (): Promise<Menu[]> => {
    const response = await api.get('/menus')
    return response.data
  },

  // Get menu tree structure
  getTree: async (): Promise<Menu[]> => {
    const response = await api.get('/menus/tree')
    return response.data
  },

  // Get single menu by ID
  getById: async (id: string): Promise<Menu> => {
    const response = await api.get(`/menus/${id}`)
    return response.data
  },

  // Create new menu
  create: async (data: CreateMenuRequest): Promise<Menu> => {
    const response = await api.post('/menus', data)
    return response.data
  },

  // Update existing menu
  update: async (id: string, data: UpdateMenuRequest): Promise<Menu> => {
    const response = await api.patch(`/menus/${id}`, data)
    return response.data
  },

  // Delete menu
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/menus/${id}`)
    return response.data
  },

  // Move menu to different parent
  move: async (id: string, data: MoveMenuRequest): Promise<Menu> => {
    const response = await api.patch(`/menus/${id}/move`, data)
    return response.data
  },

  // Reorder menus
  reorder: async (data: ReorderMenusRequest): Promise<Menu[]> => {
    const response = await api.post('/menus/reorder', data)
    return response.data
  },
}

export default api