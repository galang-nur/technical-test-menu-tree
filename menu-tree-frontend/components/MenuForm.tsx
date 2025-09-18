'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createMenuSchema, type CreateMenuFormData } from '@/lib/validations'
import { useCreateMenu, useUpdateMenu, useMenus } from '@/hooks/useMenus'
import { Menu } from '@/types/menu'
import { Loader2, Save, X } from 'lucide-react'

interface MenuFormProps {
  menu?: Menu
  parentId?: string
  onCancel: () => void
  onSuccess?: (menu: Menu) => void
}

export function MenuForm({ menu, parentId, onCancel, onSuccess }: MenuFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: allMenus = [] } = useMenus()
  const createMenuMutation = useCreateMenu()
  const updateMenuMutation = useUpdateMenu()

  const isEditMode = !!menu

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateMenuFormData>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {
      name: menu?.name || '',
      description: menu?.description || '',
      icon: menu?.icon || '',
      url: menu?.url || '',
      order: menu?.order || 0,
      isActive: menu?.isActive ?? true,
      parentId: parentId || menu?.parentId || '',
    },
  })

  const onSubmit = async (data: CreateMenuFormData) => {
    setIsSubmitting(true)
    try {
      let result: Menu

      if (isEditMode) {
        result = await updateMenuMutation.mutateAsync({
          id: menu.id,
          data: {
            ...data,
            parentId: data.parentId || undefined,
          },
        })
      } else {
        result = await createMenuMutation.mutateAsync({
          ...data,
          parentId: data.parentId || undefined,
        })
      }

      onSuccess?.(result)
      if (!isEditMode) {
        reset()
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get potential parent options (exclude self and descendants in edit mode)
  const parentOptions = allMenus.filter(m => {
    if (!isEditMode) return true
    if (m.id === menu?.id) return false
    // In a real implementation, you'd check for descendants too
    return true
  })

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditMode ? 'Edit Menu' : 'Create New Menu'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name *
              </label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Menu name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium mb-1">
                Icon
              </label>
              <Input
                id="icon"
                {...register('icon')}
                placeholder="e.g., dashboard, users"
                className={errors.icon ? 'border-red-500' : ''}
              />
              {errors.icon && (
                <p className="text-sm text-red-500 mt-1">{errors.icon.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Menu description"
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-1">
                URL
              </label>
              <Input
                id="url"
                {...register('url')}
                placeholder="/dashboard"
                className={errors.url ? 'border-red-500' : ''}
              />
              {errors.url && (
                <p className="text-sm text-red-500 mt-1">{errors.url.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium mb-1">
                Order
              </label>
              <Input
                id="order"
                type="number"
                {...register('order', { valueAsNumber: true })}
                placeholder="0"
                className={errors.order ? 'border-red-500' : ''}
              />
              {errors.order && (
                <p className="text-sm text-red-500 mt-1">{errors.order.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="parentId" className="block text-sm font-medium mb-1">
              Parent Menu
            </label>
            <select
              id="parentId"
              {...register('parentId')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Root Level</option>
              {parentOptions.map(parentMenu => (
                <option key={parentMenu.id} value={parentMenu.id}>
                  {parentMenu.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isActive"
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (!isDirty && isEditMode)}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-1" />
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}