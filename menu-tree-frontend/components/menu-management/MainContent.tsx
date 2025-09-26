import type { Menu } from "@/types/menu"

interface MainContentProps {
  menus: Menu[]
  selectedMenu: string | null
  flatMenus: Menu[]
  expandedMenus: Set<string>
  toggleExpanded: (menuId: string) => void
  expandAll: () => void
  collapseAll: () => void
  handleSelectMenu: (menu: Menu) => void
  handleAddChild: (parentMenu: Menu) => void
}

export function MainContent({
  menus,
  selectedMenu,
  flatMenus,
  expandedMenus,
  toggleExpanded,
  expandAll,
  collapseAll,
  handleSelectMenu,
  handleAddChild,
}: MainContentProps) {
  const renderMainTree = (menuList: Menu[], level = 0) => {
    return menuList.map((menu) => (
      <div key={menu.id}>
        <div
          className={`flex items-center px-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-md transition-colors group ${
            selectedMenu === menu.id ? "bg-blue-50 border-l-2 border-blue-500" : ""
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
                className={`w-4 h-4 transition-transform ${expandedMenus.has(menu.id) ? "rotate-90" : ""}`}
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

          {selectedMenu === menu.id && (
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
          expandedMenus.has(menu.id) &&
          renderMainTree(menu.children, level + 1)}
      </div>
    ))
  }

  return (
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
            value={selectedMenu || ""}
            onChange={(e) => {
              const menuId = e.target.value
              if (menuId) {
                const menu = flatMenus.find((m) => m.id === menuId)
                if (menu) handleSelectMenu(menu)
              }
            }}
            className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">system management</option>
            {flatMenus.map((menu) => (
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
              onClick={expandAll}
              className="cursor-pointer rounded-2xl px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 text-sm"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="cursor-pointer rounded-2xl px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Main Tree View */}
        <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
          <div className="space-y-1 relative">{renderMainTree(menus)}</div>
        </div>
      </div>
    </div>
  )
}