"use client"

import { useState } from "react"
import type { Menu } from "@/types/menu"
import { useMenuTree, useCreateMenu, useUpdateMenu, useDeleteMenu } from "@/hooks/useMenus"
import { useMenuTreeOperations } from "@/hooks/useMenuTree"
import { Sidebar } from "./Sidebar"
import { MainContent } from "./MainContent"
import { FormPanel } from "./FormPanel"
import { MobileForm } from "./MobileForm"
import { LoadingState } from "./LoadingState"
import { ErrorState } from "./ErrorState"

interface FormData {
  name: string
  description: string
  icon: string
  url: string
  order: number
  isActive: boolean
  parentId: string
}

interface UIState {
  sidebarCollapsed: boolean
  showMobileForm: boolean
  isEditMode: boolean
}

export function MenuManagementClient() {
  // Custom hooks for data management
  const { data: menus = [], isLoading, error } = useMenuTree()
  const createMenuMutation = useCreateMenu()
  const updateMenuMutation = useUpdateMenu()
  const deleteMenuMutation = useDeleteMenu()
  
  // Custom hook for tree operations
  const {
    expandedMenus,
    selectedMenu,
    flatMenus,
    toggleExpanded,
    expandAll,
    collapseAll,
    selectMenu,
    getSelectedMenu,
  } = useMenuTreeOperations(menus)

  // Local state for form and UI
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    icon: "",
    url: "",
    order: 0,
    isActive: true,
    parentId: "",
  })

  const [uiState, setUIState] = useState<UIState>({
    sidebarCollapsed: false,
    showMobileForm: false,
    isEditMode: false,
  })

  // Select menu handler
  const handleSelectMenu = (menu: Menu) => {
    selectMenu(menu.id)
    setFormData({
      name: menu.name,
      description: menu.description || "",
      icon: menu.icon || "",
      url: menu.url || "",
      order: menu.order,
      isActive: menu.isActive,
      parentId: menu.parentId || "",
    })
    setUIState(prev => ({
      ...prev,
      isEditMode: true,
      showMobileForm: true,
    }))
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setUIState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }))
  }

  // New menu handler
  const handleNewMenu = () => {
    selectMenu(null)
    setFormData({
      name: "",
      description: "",
      icon: "",
      url: "",
      order: 0,
      isActive: true,
      parentId: "",
    })
    setUIState(prev => ({
      ...prev,
      isEditMode: false,
      showMobileForm: true,
    }))
  }

  // Add child menu handler
  const handleAddChild = (parentMenu: Menu) => {
    selectMenu(null)
    setFormData({
      name: "",
      description: "",
      icon: "",
      url: "",
      order: 0,
      isActive: true,
      parentId: parentMenu.id,
    })
    setUIState(prev => ({
      ...prev,
      isEditMode: false,
      showMobileForm: true,
    }))
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      parentId: formData.parentId || undefined,
      order: Number(formData.order),
    }

    try {
      if (uiState.isEditMode && selectedMenu) {
        await updateMenuMutation.mutateAsync({
          id: selectedMenu,
          data: submitData,
        })
      } else {
        await createMenuMutation.mutateAsync(submitData)
        // Reset form after create
        setFormData({
          name: "",
          description: "",
          icon: "",
          url: "",
          order: 0,
          isActive: true,
          parentId: "",
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // Delete menu
  const handleDelete = async () => {
    const selectedMenuData = getSelectedMenu()
    if (!selectedMenuData || !selectedMenu) return
    
    if (!confirm(`Are you sure you want to delete "${selectedMenuData.name}"?`)) return

    try {
      await deleteMenuMutation.mutateAsync(selectedMenu)
      handleNewMenu()
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  // Calculate menu depth
  const getMenuDepth = (menu: Menu | null): number => {
    if (!menu || !menu.parentId) return 0
    const parent = flatMenus.find((m) => m.id === menu.parentId)
    return parent ? 1 + getMenuDepth(parent) : 0
  }

  // Update form data
  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Loading state
  if (isLoading) {
    return <LoadingState />
  }

  // Error state
  if (error) {
    return <ErrorState />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          menus={menus}
          selectedMenu={selectedMenu}
          sidebarCollapsed={uiState.sidebarCollapsed}
          expandedMenus={expandedMenus}
          toggleExpanded={toggleExpanded}
          toggleSidebar={toggleSidebar}
          handleSelectMenu={handleSelectMenu}
        />

        <div className="flex-1 flex min-w-0">
          <MainContent
            menus={menus}
            selectedMenu={selectedMenu}
            flatMenus={flatMenus}
            expandedMenus={expandedMenus}
            toggleExpanded={toggleExpanded}
            expandAll={expandAll}
            collapseAll={collapseAll}
            handleSelectMenu={handleSelectMenu}
            handleAddChild={handleAddChild}
          />

          <FormPanel
            formData={formData}
            uiState={uiState}
            selectedMenu={selectedMenu}
            flatMenus={flatMenus}
            getSelectedMenu={getSelectedMenu}
            getMenuDepth={getMenuDepth}
            updateFormData={updateFormData}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            createMenuMutation={createMenuMutation}
            updateMenuMutation={updateMenuMutation}
            deleteMenuMutation={deleteMenuMutation}
          />
        </div>
      </div>

      {uiState.showMobileForm && (
        <MobileForm
          formData={formData}
          uiState={uiState}
          selectedMenu={selectedMenu}
          updateFormData={updateFormData}
          handleSubmit={handleSubmit}
          setUIState={setUIState}
          createMenuMutation={createMenuMutation}
          updateMenuMutation={updateMenuMutation}
        />
      )}
    </div>
  )
}