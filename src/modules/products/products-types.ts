import { z } from 'zod'
import type { productsTable } from '../../db/schema/users.js'

export const createProductsSchema = z.object({
  name: z.string().min(4),
  price: z.coerce.number().positive(),
})

export type TDrizzleProduct = typeof productsTable.$inferSelect

export type TProductDTO = {
  id: string
  name: string
  price: number
}

export type TCreateProductsSchema = z.infer<typeof createProductsSchema>
