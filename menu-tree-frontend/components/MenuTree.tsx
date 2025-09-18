// src/components/menu/MenuTree.tsx
'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Menu } from '@/types/menu'
import { useMenuTreeOperations } from '@/hooks/useMenuTree'
import { useMoveMenu, useReorderMenus, useDeleteMenu } from '@/hooks/useMenus'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  GripVertical,
  Folder,
  File,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuTreeProps {
  menus: Menu[]
  onEditMenu: (menu: Menu) => void
  onCreateSubmenu: (parentId: string) => void
  onCreateMenu: () => void
  className?: string
}

interface MenuItemProps {
  menu: Menu
  index: number
  level: number
  isExpanded: boolean
  hasChildren: boolean
  onToggleExpanded: (menuId: string) => void
  onEditMenu: (menu: Menu) => void
  onCreateSubmenu: (parentId: string) => void
  onDeleteMenu: (menuId: string) => void
}

function MenuItem({
  menu,
  index,
  level,
  isExpanded,
  hasChildren,
  onToggleExpanded,
  onEditMenu,
  onCreateSubmenu,
  onDeleteMenu,
}: MenuItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Draggable draggableId={menu.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "group relative",
            snapshot.isDragging && "z-50"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card 
            className={cn(
              "mb-2 transition-all duration-200",
              snapshot.isDragging && "shadow-lg rotate-2",
              !menu.isActive && "opacity-60",
              level > 0 && "ml-6 border-l-4 border-l-blue-200"
            )}
            style={{ marginLeft: level * 24 }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Drag Handle */}
                  <div {...provided.dragHandleProps}>
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                  </div>

                  {/* Expand/Collapse Button */}
                  {hasChildren ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={() => onToggleExpanded(menu.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    <div className="w-6" />
                  )}

                  {/* Menu Icon */}
                  <div className="flex items-center gap-2">
                    {hasChildren ? (
                      <Folder className="h-4 w-4 text-blue-600" />
                    ) : (
                      <File className="h-4 w-4 text-gray-600" />
                    )}
                    
                    {menu.icon && (
                      <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {menu.icon.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Menu Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{menu.name}</h4>
                      <div className="flex items-center gap-1">
                        {!menu.isActive && <EyeOff className="h-3 w-3 text-gray-400" />}
                        {hasChildren && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">
                            {menu.children?.length || 0}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {menu.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {menu.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Order: {menu.order}</span>
                      {menu.url && (
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          <span className="truncate max-w-32">{menu.url}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className={cn(
                  "flex items-center gap-2 transition-opacity",
                  !isHovered && "opacity-0 group-hover:opacity-100"
                )}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-auto"
                    onClick={() => onCreateSubmenu(menu.id)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-auto"
                    onClick={() => onEditMenu(menu)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-auto text-red-600 hover:text-red-700"
                    onClick={() => onDeleteMenu(menu.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Children */}
          {hasChildren && isExpanded && menu.children && (
            <Droppable droppableId={`submenu-${menu.id}`} type="MENU">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {menu.children?.map((child, childIndex) => (
                    <MenuItem
                      key={child.id}
                      menu={child}
                      index={childIndex}
                      level={level + 1}
                      isExpanded={isExpanded}
                      hasChildren={!!(child.children && child.children.length > 0)}
                      onToggleExpanded={onToggleExpanded}
                      onEditMenu={onEditMenu}
                      onCreateSubmenu={onCreateSubmenu}
                      onDeleteMenu={onDeleteMenu}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  )
}

export function MenuTree({
  menus,
  onEditMenu,
  onCreateSubmenu,
  onCreateMenu,
  className,
}: MenuTreeProps) {
  const {
    isExpanded,
    toggleExpanded,
    expandAll,
    collapseAll,
  } = useMenuTreeOperations(menus)

  const moveMenuMutation = useMoveMenu()
  const reorderMenusMutation = useReorderMenus()
  const deleteMenuMutation = useDeleteMenu()

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    // Handle moving to different parent or reordering
    if (source.droppableId !== destination.droppableId) {
      // Moving to different parent
      const newParentId = destination.droppableId === 'root' 
        ? undefined 
        : destination.droppableId.replace('submenu-', '')

      moveMenuMutation.mutate({
        id: draggableId,
        data: { parentId: newParentId },
      })
    } else {
      // Reordering within same parent
      const parentId = source.droppableId === 'root' 
        ? null 
        : source.droppableId.replace('submenu-', '')

      // Create new order array
      const sourceMenus = parentId === null 
        ? menus.filter(m => !m.parentId)
        : menus.find(m => m.id === parentId)?.children || []

      const reorderedMenus = [...sourceMenus]
      const [moved] = reorderedMenus.splice(source.index, 1)
      reorderedMenus.splice(destination.index, 0, moved)

      const orders = reorderedMenus.map((menu, index) => ({
        id: menu.id,
        order: index,
      }))

      reorderMenusMutation.mutate({
        parentId,
        orders,
      })
    }
  }

  const handleDeleteMenu = (menuId: string) => {
    if (window.confirm('Are you sure you want to delete this menu? This action cannot be undone.')) {
      deleteMenuMutation.mutate(menuId)
    }
  }

  const rootMenus = menus.filter(menu => !menu.parentId)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tree Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Menu Tree</h3>
          <Badge variant="secondary">
            {menus.length} items
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
          >
            Collapse All
          </Button>
          <Button
            onClick={onCreateMenu}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Menu
          </Button>
        </div>
      </div>

      {/* Tree View */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="root" type="MENU">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "min-h-32 rounded-lg border-2 border-dashed p-4 transition-colors",
                snapshot.isDraggingOver 
                  ? "border-blue-300 bg-blue-50" 
                  : "border-gray-200"
              )}
            >
              {rootMenus.length === 0 ? (
                <div className="text-center py-8">
                  <Folder className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No menus yet</p>
                  <Button onClick={onCreateMenu} variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Your First Menu
                  </Button>
                </div>
              ) : (
                rootMenus.map((menu, index) => (
                  <MenuItem
                    key={menu.id}
                    menu={menu}
                    index={index}
                    level={0}
                    isExpanded={isExpanded(menu.id)}
                    hasChildren={!!(menu.children && menu.children.length > 0)}
                    onToggleExpanded={toggleExpanded}
                    onEditMenu={onEditMenu}
                    onCreateSubmenu={onCreateSubmenu}
                    onDeleteMenu={handleDeleteMenu}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Loading States */}
      {(moveMenuMutation.isPending || reorderMenusMutation.isPending) && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-blue-600">Updating menu structure...</span>
        </div>
      )}
    </div>
  )
}

