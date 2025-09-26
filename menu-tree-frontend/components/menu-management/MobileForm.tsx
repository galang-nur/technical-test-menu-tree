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

interface MobileFormProps {
  formData: FormData
  uiState: UIState
  selectedMenu: string | null
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void
  handleSubmit: (e: React.FormEvent) => void
  setUIState: React.Dispatch<React.SetStateAction<UIState>>
  createMenuMutation: UseMutationResult<Menu, Error, CreateMenuRequest, unknown>
  updateMenuMutation: UseMutationResult<Menu, Error, { id: string; data: UpdateMenuRequest }, unknown>
}

export function MobileForm({
  formData,
  uiState,
  selectedMenu,
  updateFormData,
  handleSubmit,
  setUIState,
  createMenuMutation,
  updateMenuMutation,
}: MobileFormProps) {
  return (
    <div className="lg:hidden fixed inset-0 bg-black/80 z-50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{uiState.isEditMode ? "Edit Menu" : "Add New Menu"}</h3>
            <button
              onClick={() => setUIState(prev => ({ ...prev, showMobileForm: false }))}
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
                value={selectedMenu || "56320ee9-6af6-11ed-a7ba-f220afe5e4a9"}
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
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="System Code"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={createMenuMutation.isPending || updateMenuMutation.isPending}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(createMenuMutation.isPending || updateMenuMutation.isPending) ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}