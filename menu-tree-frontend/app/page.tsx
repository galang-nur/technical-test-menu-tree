"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Menu } from "@/types/menu"
import Link from "next/link"
import Image from "next/image"

interface DashboardState {
  menus: Menu[]
  selectedMenuId: string | null
  selectedMenu: Menu | null
  isLoading: boolean
  error: string | null
  sidebarCollapsed: boolean
  expandedItems: Set<string>
  formData: {
    name: string
    description: string
    icon: string
    url: string
    order: number
    isActive: boolean
    parentId: string
  }
  isEditMode: boolean
  showMobileForm: boolean
}

export default function HomePage() {
  const [state, setState] = useState<DashboardState>({
    menus: [],
    selectedMenuId: null,
    selectedMenu: null,
    isLoading: true,
    error: null,
    sidebarCollapsed: false,
    expandedItems: new Set(),
    formData: {
      name: "",
      description: "",
      icon: "",
      url: "",
      order: 0,
      isActive: true,
      parentId: "",
    },
    isEditMode: false,
    showMobileForm: false,
  })

  // Fetch menus
  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/tree`)
      if (!response.ok) throw new Error("Failed to fetch menus")
      const data = await response.json()

      setState((prev) => ({
        ...prev,
        menus: data,
        isLoading: false,
        // Auto-expand first level
        expandedItems: new Set(data.map((menu: Menu) => menu.id)),
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      }))
    }
  }

  // Get all menus in flat structure
  const getAllMenusFlat = (menuList: Menu[]): Menu[] => {
    const result: Menu[] = []
    const flatten = (menus: Menu[]) => {
      menus.forEach((menu) => {
        result.push(menu)
        if (menu.children) flatten(menu.children)
      })
    }
    flatten(menuList)
    return result
  }

  const allMenusFlat = getAllMenusFlat(state.menus)

  // Select menu handler
  const handleSelectMenu = (menu: Menu) => {
    setState((prev) => ({
      ...prev,
      selectedMenuId: menu.id,
      selectedMenu: menu,
      formData: {
        name: menu.name,
        description: menu.description || "",
        icon: menu.icon || "",
        url: menu.url || "",
        order: menu.order,
        isActive: menu.isActive,
        parentId: menu.parentId || "",
      },
      isEditMode: true,
      showMobileForm: true, // Show form on mobile when selecting
    }))
  }

  // Toggle expand/collapse item
  const toggleExpanded = (menuId: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedItems)
      if (newExpanded.has(menuId)) {
        newExpanded.delete(menuId)
      } else {
        newExpanded.add(menuId)
      }
      return { ...prev, expandedItems: newExpanded }
    })
  }

  const toggleSidebar = () => {
    setState((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }))
  }

  // New menu handler
  const handleNewMenu = () => {
    setState((prev) => ({
      ...prev,
      selectedMenuId: null,
      selectedMenu: null,
      formData: {
        name: "",
        description: "",
        icon: "",
        url: "",
        order: 0,
        isActive: true,
        parentId: "",
      },
      isEditMode: false,
      showMobileForm: true,
    }))
  }

  const handleAddChild = (parentMenu: Menu) => {
    setState((prev) => ({
      ...prev,
      selectedMenuId: null,
      selectedMenu: null,
      formData: {
        name: "",
        description: "",
        icon: "",
        url: "",
        order: 0,
        isActive: true,
        parentId: parentMenu.id, // Set parent ID for new child
      },
      isEditMode: false,
      showMobileForm: true, // Show form on mobile
    }))
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = state.isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/menus/${state.selectedMenuId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/menus`

      const method = state.isEditMode ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...state.formData,
          parentId: state.formData.parentId || null,
          order: Number(state.formData.order),
        }),
      })

      if (!response.ok) throw new Error(`Failed to ${state.isEditMode ? "update" : "create"} menu`)

      await fetchMenus()
      alert(`Menu ${state.isEditMode ? "updated" : "created"} successfully!`)

      if (!state.isEditMode) {
        // Reset form after create
        setState((prev) => ({
          ...prev,
          formData: {
            name: "",
            description: "",
            icon: "",
            url: "",
            order: 0,
            isActive: true,
            parentId: "",
          },
        }))
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  // Delete menu
  const handleDelete = async () => {
    if (!state.selectedMenu) return
    if (!confirm(`Are you sure you want to delete "${state.selectedMenu.name}"?`)) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${state.selectedMenuId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete menu")

      await fetchMenus()
      handleNewMenu() // Reset selection
      alert("Menu deleted successfully!")
    } catch (err) {
      alert(`Error deleting menu: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  // Calculate menu depth
  const getMenuDepth = (menu: Menu | null): number => {
    if (!menu || !menu.parentId) return 0
    const parent = allMenusFlat.find((m) => m.id === menu.parentId)
    return parent ? 1 + getMenuDepth(parent) : 0
  }

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }))
  }

  const renderSidebarTree = (menuList: Menu[], level = 0) => {
    return menuList.map((menu) => (
      <div key={menu.id}>
        {level > 0 && (
        <div
            className="absolute left-0 top-0 flex items-center"
            style={{ left: `${8 + (level - 1) * 16}px` }}
            >
            <div className="w-px h-full bg-white/30"></div>
            <div className="w-4 h-px bg-white/30"></div>
            </div>
        )}
        <div
          className={`flex items-center px-3 py-2.5 cursor-pointer hover:bg-white/10 rounded-md transition-colors group ${
            state.selectedMenuId === menu.id ? "bg-white/20 border-r-2 border-white" : ""
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => handleSelectMenu(menu)}
        >
          {/* Expand/Collapse Button */}
          {menu.children && menu.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(menu.id)
              }}
              className="mr-2 p-0.5 hover:bg-white/20 rounded"
            >
              <svg
                className={`w-3 h-3 transition-transform ${state.expandedItems.has(menu.id) ? "rotate-90" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </button>
          )}

          {/* Menu Icon */}
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            {menu.children && menu.children.length > 0 ? (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            ) : (
              <div className="w-2 h-2 bg-white/60 rounded-full" />
            )}
          </div>

          {/* Menu Name */}
          <span className={`text-sm text-white truncate ${!state.sidebarCollapsed ? "block" : "hidden"}`}>
            {menu.name}
          </span>
        </div>

        {/* Children */}
        {menu.children &&
          menu.children.length > 0 &&
          state.expandedItems.has(menu.id) &&
          renderSidebarTree(menu.children, level + 1)}
      </div>
    ))
  }

  const renderMainTree = (menuList: Menu[], level = 0) => {
    return menuList.map((menu) => (
      <div key={menu.id}>
        <div
          className={`flex items-center px-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-md transition-colors group ${
            state.selectedMenuId === menu.id ? "bg-blue-50 border-l-2 border-blue-500" : ""
          }`}
          style={{ paddingLeft: `${12 + level * 24}px` }}
          onClick={() => handleSelectMenu(menu)}
        >
          {/* Tree Lines */}
          {level > 0 && (
            <div className="absolute left-0" style={{ left: `${12 + (level - 1) * 24 + 8}px` }}>
              <div className="w-px h-6 bg-gray-300 -mt-3" />
              <div className="w-4 h-px bg-gray-300 mt-3" />
            </div>
          )}

          {/* Expand/Collapse Button */}
          {menu.children && menu.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(menu.id)
              }}
              className="mr-2 p-0.5 hover:bg-gray-200 rounded"
            >
              <svg
                className={`w-4 h-4 transition-transform ${state.expandedItems.has(menu.id) ? "rotate-90" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </button>
          )}

          {/* Menu Icon */}
          <div className="w-5 h-5 mr-3 flex items-center justify-center">
            {menu.children && menu.children.length > 0 ? (
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            ) : (
              <div className="w-3 h-3 bg-gray-400 rounded-sm" />
            )}
          </div>

          {/* Menu Name */}
          <span className="text-sm font-medium text-gray-900 flex-1">{menu.name}</span>

          {state.selectedMenuId === menu.id && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAddChild(menu)
              }}
              className="ml-auto w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              title="Add child menu"
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Children */}
        {menu.children &&
          menu.children.length > 0 &&
          state.expandedItems.has(menu.id) &&
          renderMainTree(menu.children, level + 1)}
      </div>
    ))
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">Failed to connect to the backend API.</p>
          <div className="space-y-2">
            <button
              onClick={fetchMenus}
              className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
            <Link href="/" className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Back to Tree View
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div
          className={`hidden lg:block bg-blue-600 text-white transition-all duration-300 flex-shrink-0 ${
            state.sidebarCollapsed ? "w-16" : "w-64"
          } h-screen overflow-hidden`}
        >
            {/* Header */}
            <div className="p-4 border-b border-blue-500">
            <div className="flex items-center">
                {!state.sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                    <Image src="/logo.svg" width={32} height={48} alt="Logo" className="w-24 h-12" />
                </div>
                )}
                <button onClick={toggleSidebar} className="ml-auto p-1 hover:bg-blue-500 rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    />
                </svg>
                </button>
            </div>
            </div>

            {/* Navigation */}
            <div className="p-2 flex-1 overflow-y-auto">

            {/* Database Menu Tree */}
            {state.isLoading ? (
                <div className="px-3 py-4 text-center text-blue-200 text-sm">
                Loading...
                </div>
            ) : state.menus.length === 0 ? (
                <div className="px-3 py-4 text-center text-blue-200 text-sm">
                {!state.sidebarCollapsed ? 'No menus found' : '!'}
                </div>
            ) : (
                !state.sidebarCollapsed && (
                    <div className="space-y-0.5 overflow-y-auto">
                    {renderSidebarTree(state.menus)}
                    </div>
                )
            )}
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-w-0">
          <div className="flex-1 p-4 lg:p-6 min-w-0">
            <div className="bg-white rounded-lg shadow-sm h-full">
              {/* Header */}
              <div className="px-4 lg:px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                    </div>
                    <h1 className="text-xl lg:text-2xl font-bold">Menus</h1>
                  </div>
                </div>
              </div>

              {/* Menu Selector */}
              <div className="px-4 lg:px-6 py-4 border-b">
                <label className="block text-sm font-medium text-gray-700 mb-2">Menu</label>
                <select
                  value={state.selectedMenuId || ""}
                  onChange={(e) => {
                    const menuId = e.target.value
                    if (menuId) {
                      const menu = getAllMenusFlat(state.menus).find((m) => m.id === menuId)
                      if (menu) handleSelectMenu(menu)
                    }
                  }}
                  className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">system management</option>
                  {getAllMenusFlat(state.menus).map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Control Buttons */}
              <div className="px-4 lg:px-6 py-4 border-b">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        expandedItems: new Set(getAllMenusFlat(state.menus).map((m) => m.id)),
                      }))
                    }
                    className="cursor-pointer rounded-2xl px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 text-sm"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        expandedItems: new Set(),
                      }))
                    }
                    className="cursor-pointer rounded-2xl px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Main Tree View */}
              <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
                {state.isLoading ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500">Loading menu data...</div>
                  </div>
                ) : (
                  <div className="space-y-1 relative">{renderMainTree(state.menus)}</div>
                )}
              </div>
            </div>
          </div>

          <div className="w-80 bg-white border-l flex-shrink-0 hidden lg:block">
            <div className="p-6 h-full overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">{state.isEditMode ? "Edit Menu" : "Add New Menu"}</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Menu ID</label>
                  <input
                    type="text"
                    value={state.selectedMenuId || "56320ee9-6af6-11ed-a7ba-f220afe5e4a9"}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Depth</label>
                  <input
                    type="text"
                    value={
                      state.formData.parentId
                        ? getMenuDepth(
                            getAllMenusFlat(state.menus).find((m) => m.id === state.formData.parentId) || null,
                          ) + 1
                        : 3
                    }
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Data</label>
                  <select
                    value={state.formData.parentId}
                    onChange={(e) => updateFormData("parentId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Systems</option>
                    {getAllMenusFlat(state.menus)
                      .filter((menu) => (state.selectedMenuId ? menu.id !== state.selectedMenuId : true))
                      .map((menu) => (
                        <option key={menu.id} value={menu.id}>
                          {menu.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={state.formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="System Code"
                  />
                </div>

                <div className="pt-4">
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                    >
                      Save
                    </button>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      Dashboard View
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {state.showMobileForm && (
        <div className="lg:hidden fixed inset-0 bg-black/80 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{state.isEditMode ? "Edit Menu" : "Add New Menu"}</h3>
                <button
                  onClick={() => setState((prev) => ({ ...prev, showMobileForm: false }))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Menu ID</label>
                  <input
                    type="text"
                    value={state.selectedMenuId || "56320ee9-6af6-11ed-a7ba-f220afe5e4a9"}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Depth</label>
                  <input
                    type="text"
                    value={3}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Data</label>
                  <input
                    type="text"
                    value="Systems"
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={state.formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="System Code"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
