import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menuApi } from '@/lib/api'
import { Menu, CreateMenuRequest, UpdateMenuRequest, MoveMenuRequest, ReorderMenusRequest } from '@/types/menu'
import { toast } from 'sonner'

const QUERY_KEYS = {
  menus: ['menus'] as const,
  menuTree: ['menus', 'tree'] as const,
  menu: (id: string) => ['menus', id] as const,
}

// Get all menus (flat list)
export function useMenus() {
  return useQuery({
    queryKey: QUERY_KEYS.menus,
    queryFn: menuApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get menu tree structure
export function useMenuTree() {
  return useQuery({
    queryKey: QUERY_KEYS.menuTree,
    queryFn: menuApi.getTree,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single menu by ID
export function useMenu(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.menu(id),
    queryFn: () => menuApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Create menu mutation
export function useCreateMenu() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.create,
    onSuccess: (newMenu) => {
      // Invalidate and refetch menu queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menus })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menuTree })
      
      toast.success(`Menu "${newMenu.name}" created successfully!`)
    },
    onError: (error: Error) => {
      toast.error(`Failed to create menu: ${error.message}`)
    },
  })
}

// Update menu mutation
export function useUpdateMenu() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuRequest }) => 
      menuApi.update(id, data),
    onSuccess: (updatedMenu, { id }) => {
      // Update the cache
      queryClient.setQueryData(QUERY_KEYS.menu(id), updatedMenu)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menus })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menuTree })
      
      toast.success(`Menu "${updatedMenu.name}" updated successfully!`)
    },
    onError: (error: Error) => {
      toast.error(`Failed to update menu: ${error.message}`)
    },
  })
}

// Delete menu mutation
export function useDeleteMenu() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.delete,
    onSuccess: (result, id) => {
      // Remove from cache and invalidate queries
      queryClient.removeQueries({ queryKey: QUERY_KEYS.menu(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menus })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menuTree })
      
      toast.success(result.message)
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete menu: ${error.message}`)
    },
  })
}

// Move menu mutation
export function useMoveMenu() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MoveMenuRequest }) => 
      menuApi.move(id, data),
    onSuccess: (movedMenu, { id }) => {
      queryClient.setQueryData(QUERY_KEYS.menu(id), movedMenu)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menus })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menuTree })
      
      toast.success(`Menu "${movedMenu.name}" moved successfully!`)
    },
    onError: (error: Error) => {
      toast.error(`Failed to move menu: ${error.message}`)
    },
  })
}

// Reorder menus mutation
export function useReorderMenus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menus })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menuTree })
      
      toast.success('Menus reordered successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to reorder menus: ${error.message}`)
    },
  })
}

// src/hooks/useMenuTree.ts
