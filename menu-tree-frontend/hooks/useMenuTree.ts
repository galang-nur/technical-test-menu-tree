import { useState, useCallback, useMemo } from 'react'
import { Menu } from '@/types/menu'
import { findMenuById, flattenMenuTree } from '@/lib/utils'


export function useMenuTreeOperations(menus: Menu[]) {
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)

  // Flatten menu tree for search and operations
  const flatMenus = useMemo(() => flattenMenuTree(menus), [menus])

  // Toggle menu expansion
  const toggleExpanded = useCallback((menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      } else {
        newSet.add(menuId)
      }
      return newSet
    })
  }, [])

  // Expand all menus
  const expandAll = useCallback(() => {
    const allMenuIds = flatMenus.map(menu => menu.id)
    setExpandedMenus(new Set(allMenuIds))
  }, [flatMenus])

  // Collapse all menus
  const collapseAll = useCallback(() => {
    setExpandedMenus(new Set())
  }, [])

  // Check if menu is expanded
  const isExpanded = useCallback((menuId: string) => {
    return expandedMenus.has(menuId)
  }, [expandedMenus])

  // Select menu
  const selectMenu = useCallback((menuId: string | null) => {
    setSelectedMenu(menuId)
  }, [])

  // Get selected menu data
  const getSelectedMenu = useCallback(() => {
    if (!selectedMenu) return null
    return findMenuById(menus, selectedMenu)
  }, [menus, selectedMenu])

  // Get menu path (breadcrumb)
  const getMenuPath = useCallback((menuId: string): Menu[] => {
    const path: Menu[] = []
    let currentMenu = findMenuById(menus, menuId)
    
    while (currentMenu) {
      path.unshift(currentMenu)
      if (currentMenu.parentId) {
        currentMenu = findMenuById(menus, currentMenu.parentId)
      } else {
        break
      }
    }
    
    return path
  }, [menus])

  // Get menu children
  const getMenuChildren = useCallback((parentId: string | null): Menu[] => {
    if (parentId === null) {
      return menus.filter(menu => !menu.parentId)
    }
    
    const parentMenu = findMenuById(menus, parentId)
    return parentMenu?.children || []
  }, [menus])

  // Check if menu has children
  const hasChildren = useCallback((menuId: string): boolean => {
    const menu = findMenuById(menus, menuId)
    return !!(menu?.children && menu.children.length > 0)
  }, [menus])

  return {
    expandedMenus,
    selectedMenu,
    flatMenus,
    toggleExpanded,
    expandAll,
    collapseAll,
    isExpanded,
    selectMenu,
    getSelectedMenu,
    getMenuPath,
    getMenuChildren,
    hasChildren,
  }
}