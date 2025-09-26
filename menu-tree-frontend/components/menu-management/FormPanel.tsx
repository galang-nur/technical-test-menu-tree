import Link from "next/link"
import type { Menu, CreateMenuRequest, UpdateMenuRequest } from "@/types/menu"
import type { UseMutationResult } from "@tanstack/react-query"

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

interface FormPanelProps {
  formData: FormData
  uiState: UIState
  selectedMenu: string | null
  flatMenus: Menu[]
  getSelectedMenu: () => Menu | null
  getMenuDepth: (menu: Menu | null) => number
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void
  handleSubmit: (e: React.FormEvent) => void
  handleDelete: () => void
  createMenuMutation: UseMutationResult<Menu, Error, CreateMenuRequest, unknown>
  updateMenuMutation: UseMutationResult<Menu, Error, { id: string; data: UpdateMenuRequest }, unknown>
  deleteMenuMutation: UseMutationResult<{ message: string }, Error, string, unknown>
}

export function FormPanel({
  formData,
  uiState,
  selectedMenu,
  flatMenus,
  getSelectedMenu,
  getMenuDepth,
  updateFormData,
  handleSubmit,
  handleDelete,
  createMenuMutation,
  updateMenuMutation,
  deleteMenuMutation,
}: FormPanelProps) {
  return (
    <div className="w-80 bg-white border-l flex-shrink-0 hidden lg:block">
      <div className="p-6 h-full overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{uiState.isEditMode ? "Edit Menu" : "Add New Menu"}</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menu ID</label>
            <input
              type="text"
              value={selectedMenu || "56320ee9-6af6-11ed-a7ba-f220afe5e4a9"}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Depth</label>
            <input
              type="text"
              value={
                formData.parentId
                  ? getMenuDepth(flatMenus.find((m) => m.id === formData.parentId) || null) + 1
                  : 3
              }
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Data</label>
            <select
              value={formData.parentId}
              onChange={(e) => updateFormData("parentId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Systems</option>
              {flatMenus
                .filter((menu) => (selectedMenu ? menu.id !== selectedMenu : true))
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
              value={formData.name}
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
                disabled={createMenuMutation.isPending || updateMenuMutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(createMenuMutation.isPending || updateMenuMutation.isPending) ? "Saving..." : "Save"}
              </button>
              {uiState.isEditMode && getSelectedMenu() && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMenuMutation.isPending}
                  className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteMenuMutation.isPending ? "Deleting..." : "Delete Menu"}
                </button>
              )}
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
  )
}