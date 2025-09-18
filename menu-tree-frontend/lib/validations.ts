import { z } from "zod"

export const createMenuSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  icon: z.string()
    .max(100, "Icon must be less than 100 characters")
    .optional(),
  url: z.string()
    .max(500, "URL must be less than 500 characters")
    .optional(),
  order: z.number()
    .int()
    .min(0, "Order must be 0 or greater")
    .optional(),
  isActive: z.boolean().optional(),
  parentId: z.string().optional(),
})

export const updateMenuSchema = createMenuSchema.partial()

export type CreateMenuFormData = z.infer<typeof createMenuSchema>
export type UpdateMenuFormData = z.infer<typeof updateMenuSchema>