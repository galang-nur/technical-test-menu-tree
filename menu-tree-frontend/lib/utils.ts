import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export type Menu = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  url?: string;
  order: number;
  isActive: boolean;
  parentId?: string;
  children?: Menu[];
  createdAt: string;
  updatedAt: string;
};


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getMenuDepth(menu: Menu): number {
  if (!menu.children || menu.children.length === 0) {
    return 0
  }
  return 1 + Math.max(...menu.children.map(child => getMenuDepth(child)))
}

export function flattenMenuTree(menus: Menu[]): Menu[] {
  const result: Menu[] = []
  
  function flatten(menuList: Menu[]) {
    for (const menu of menuList) {
      result.push(menu)
      if (menu.children) {
        flatten(menu.children)
      }
    }
  }
  
  flatten(menus)
  return result
}

export function findMenuById(menus: Menu[], id: string): Menu | null {
  for (const menu of menus) {
    if (menu.id === id) return menu
    if (menu.children) {
      const found = findMenuById(menu.children, id)
      if (found) return found
    }
  }
  return null
}