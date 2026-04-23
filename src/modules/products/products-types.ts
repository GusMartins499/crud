import { z } from 'zod'
import type { productsTable } from '../../db/schema/users.js'

export const createProductSchema = z.object({
  name: z.string().min(4),
  price: z.coerce.number().positive(),
})

export const updateProductSchema = z
  .object({
    name: z.string().min(4).optional(),
    price: z.coerce.number().positive().optional(),
  })
  .refine(({ name, price }) => name !== undefined || price !== undefined, {
    error: 'At least one field (name or price) must be provided',
  })

export type TDrizzleProduct = typeof productsTable.$inferSelect

export type TProductDTO = {
  id: string
  name: string
  price: number
}

export type TCreateProductSchema = z.infer<typeof createProductSchema>
export type TUpdateProductSchema = z.infer<typeof updateProductSchema>
