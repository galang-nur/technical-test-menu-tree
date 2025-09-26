import Image from "next/image"
import type { Menu } from "@/types/menu"

interface SidebarProps {
  menus: Menu[]
  selectedMenu: string | null
  sidebarCollapsed: boolean
  expandedMenus: Set<string>
  toggleExpanded: (menuId: string) => void
  toggleSidebar: () => void
  handleSelectMenu: (menu: Menu) => void
}

export function Sidebar({
  menus,
  selectedMenu,
  sidebarCollapsed,
  expandedMenus,
  toggleExpanded,
  toggleSidebar,
  handleSelectMenu,
}: SidebarProps) {
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
            selectedMenu === menu.id ? "bg-white/20 border-r-2 border-white" : ""
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
                className={`w-3 h-3 transition-transform ${expandedMenus.has(menu.id) ? "rotate-90" : ""}`}
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
          <span className={`text-sm text-white truncate ${!sidebarCollapsed ? "block" : "hidden"}`}>
            {menu.name}
          </span>
        </div>

        {/* Children */}
        {menu.children &&
          menu.children.length > 0 &&
          expandedMenus.has(menu.id) &&
          renderSidebarTree(menu.children, level + 1)}
      </div>
    ))
  }

  return (
    <div
      className={`hidden lg:block bg-blue-600 text-white transition-all duration-300 flex-shrink-0 ${
        sidebarCollapsed ? "w-16" : "w-64"
      } min-h-screen overflow-y-auto`}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-500">
        <div className="flex items-center">
          {!sidebarCollapsed && (
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
      <div className="p-2 flex-1">
        {menus.length === 0 ? (
          <div className="px-3 py-4 text-center text-blue-200 text-sm">
            {!sidebarCollapsed ? 'No menus found' : '!'}
          </div>
        ) : (
          !sidebarCollapsed && (
            <div className="space-y-0.5">
              {renderSidebarTree(menus)}
            </div>
          )
        )}
      </div>
    </div>
  )
}