// src/components/menu/MenuActions.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDeleteMenu } from '@/hooks/useMenus'
import { Menu } from '@/types/menu'
import { 
  Edit, 
  Trash2, 
  Plus, 
  Move, 
  Eye, 
  EyeOff,
  MoreHorizontal 
} from 'lucide-react'

interface MenuActionsProps {
  menu: Menu
  onEdit: () => void
  onCreateSubmenu: () => void
  onMove?: () => void
}

export function MenuActions({ menu, onEdit, onCreateSubmenu, onMove }: MenuActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const deleteMenuMutation = useDeleteMenu()

  const handleDelete = () => {
    deleteMenuMutation.mutate(menu.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onCreateSubmenu}
        title="Add Submenu"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        title="Edit Menu"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {onMove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMove}
          title="Move Menu"
        >
          <Move className="h-4 w-4" />
        </Button>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            title="Delete Menu"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{menu.name}"? 
              {menu.children && menu.children.length > 0 && (
                <span className="block mt-2 text-red-600">
                  This menu has {menu.children.length} submenu(s). You need to delete or move them first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMenuMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMenuMutation.isPending || (menu.children && menu.children.length > 0)}
            >
              {deleteMenuMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}