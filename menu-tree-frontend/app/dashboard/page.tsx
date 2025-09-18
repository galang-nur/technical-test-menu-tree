// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Menu } from '@/types/menu'
import Link from 'next/link'

export default function DashboardPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    url: '',
    order: 0,
    isActive: true,
    parentId: ''
  })

  // Fetch menus
  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/tree`)
      if (!response.ok) throw new Error('Failed to fetch menus')
      const data = await response.json()
      setMenus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
          order: Number(formData.order)
        })
      })
      
      if (!response.ok) throw new Error('Failed to create menu')
      
      await fetchMenus()
      setIsFormOpen(false)
      resetForm()
      alert('Menu created successfully!')
    } catch (err) {
      alert('Error creating menu: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleUpdateMenu = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMenu) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${selectedMenu.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
          order: Number(formData.order)
        })
      })
      
      if (!response.ok) throw new Error('Failed to update menu')
      
      await fetchMenus()
      setIsFormOpen(false)
      setSelectedMenu(null)
      resetForm()
      alert('Menu updated successfully!')
    } catch (err) {
      alert('Error updating menu: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleDeleteMenu = async (menuId: string, menuName: string) => {
    if (!confirm(`Are you sure you want to delete "${menuName}"?`)) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${menuId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete menu')
      
      await fetchMenus()
      alert('Menu deleted successfully!')
    } catch (err) {
      alert('Error deleting menu: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      url: '',
      order: 0,
      isActive: true,
      parentId: ''
    })
  }

  const openCreateForm = () => {
    resetForm()
    setSelectedMenu(null)
    setIsFormOpen(true)
  }

  const openEditForm = (menu: Menu) => {
    setFormData({
      name: menu.name,
      description: menu.description || '',
      icon: menu.icon || '',
      url: menu.url || '',
      order: menu.order,
      isActive: menu.isActive,
      parentId: menu.parentId || ''
    })
    setSelectedMenu(menu)
    setIsFormOpen(true)
  }

  const getAllMenusFlat = (menuList: Menu[]): Menu[] => {
    const result: Menu[] = []
    const flatten = (menus: Menu[]) => {
      menus.forEach(menu => {
        result.push(menu)
        if (menu.children) flatten(menu.children)
      })
    }
    flatten(menuList)
    return result
  }

  const renderMenuTree = (menuList: Menu[], level = 0) => {
    return menuList.map(menu => (
      <div key={menu.id} className="mb-2">
        <div 
          className={`p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow ${
            level > 0 ? 'ml-6 border-l-4 border-l-blue-200' : ''
          }`}
          style={{ marginLeft: level * 24 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                {menu.icon && (
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {menu.icon.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{menu.name}</h3>
                  {menu.description && (
                    <p className="text-gray-600 text-sm">{menu.description}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>Order: {menu.order}</span>
                {menu.url && <span>URL: {menu.url}</span>}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  menu.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {menu.isActive ? 'Active' : 'Inactive'}
                </span>
                {menu.children && menu.children.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {menu.children.length} children
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => openEditForm(menu)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteMenu(menu.id, menu.name)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        
        {menu.children && menu.children.length > 0 && renderMenuTree(menu.children, level + 1)}
      </div>
    ))
  }

  const allMenusFlat = getAllMenusFlat(menus)
  const stats = {
    total: allMenusFlat.length,
    active: allMenusFlat.filter(m => m.isActive).length,
    inactive: allMenusFlat.filter(m => !m.isActive).length,
    rootLevel: menus.length
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">
            Failed to connect to the backend API. Please ensure the backend server is running on http://localhost:3001
          </p>
          <button 
            onClick={fetchMenus}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Menu Tree System</h1>
              <p className="text-gray-600">Manage your hierarchical menu structure</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Tree View
              </Link>
              <button 
                onClick={openCreateForm}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                + New Menu
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="text-blue-500 text-xl mr-3">💡</div>
            <div>
              <h3 className="font-semibold text-blue-800">Two Views Available:</h3>
              <p className="text-blue-700 text-sm">
                • <strong>Tree View (Current)</strong>: Full overview with statistics and bulk operations
                <br />
                • <strong>Dashboard View</strong>: Sidebar navigation with detailed form editing
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="text-blue-500 text-2xl mr-3">📊</div>
              <div>
                <p className="text-sm text-gray-600">Total Menus</p>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="text-green-500 text-2xl mr-3">✅</div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="text-red-500 text-2xl mr-3">❌</div>
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="text-purple-500 text-2xl mr-3">🌳</div>
              <div>
                <p className="text-sm text-gray-600">Root Level</p>
                <div className="text-2xl font-bold text-purple-600">{stats.rootLevel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Menu Management - Tree View</h2>
                <p className="text-gray-600">Hierarchical view of your menu structure</p>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center"
              >
                Switch to Dashboard
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-4xl">⏳</div>
                <span className="ml-3 text-gray-600">Loading menus...</span>
              </div>
            ) : menus.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No menus yet</h3>
                <p className="text-gray-500 mb-4">Create your first menu to get started</p>
                <button 
                  onClick={openCreateForm}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                >
                  + Create Your First Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {renderMenuTree(menus)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Modal - (keeping existing modal code) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">
                {selectedMenu ? 'Edit Menu' : 'Create New Menu'}
              </h3>
            </div>

            <form onSubmit={selectedMenu ? handleUpdateMenu : handleCreateMenu} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dashboard, users, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/dashboard"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Menu
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Root Level</option>
                  {allMenusFlat
                    .filter(menu => selectedMenu ? menu.id !== selectedMenu.id : true)
                    .map(menu => (
                      <option key={menu.id} value={menu.id}>
                        {menu.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false)
                    setSelectedMenu(null)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {selectedMenu ? 'Update Menu' : 'Create Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}