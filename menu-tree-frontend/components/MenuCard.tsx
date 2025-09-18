'use client'

import { Menu } from '@/types/menu'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { 
  Calendar,
  ExternalLink,
  Eye,
  EyeOff,
  Folder,
  Link as LinkIcon,
} from 'lucide-react'

interface MenuCardProps {
  menu: Menu
  onClick?: () => void
  className?: string
}

export function MenuCard({ menu, onClick, className }: MenuCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {menu.icon && (
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {menu.icon.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h3 className="font-semibold text-lg">{menu.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            {menu.isActive ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
            {menu.children && menu.children.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Folder className="h-3 w-3 mr-1" />
                {menu.children.length}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {menu.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {menu.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(menu.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <span>Order: {menu.order}</span>
            </div>
          </div>
          
          {menu.url && (
            <div className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              <span className="truncate max-w-20">{menu.url}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Badge variant={menu.isActive ? "default" : "secondary"}>
            {menu.isActive ? 'Active' : 'Inactive'}
          </Badge>
          
          {menu.parentId && (
            <span className="text-xs text-muted-foreground">Submenu</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}