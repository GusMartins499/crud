import { z } from 'zod'
import type { productsTable } from '../../db/schema/users.js'

export const createProductsSchema = z.object({
  name: z.string().min(4),
  price: z.coerce.number().positive(),
})

export const updateProductsSchema = z
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

export type TCreateProductsSchema = z.infer<typeof createProductsSchema>
export type TUpdateProductsSchema = z.infer<typeof updateProductsSchema>
