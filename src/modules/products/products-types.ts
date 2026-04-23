import { z } from 'zod'
import type { productsTable } from '../../db/schema/products-table.js'

export const createProductSchema = z.object({
  name: z.string().min(4),
  price: z.coerce.number().positive(),
})

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(10),
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
  formatPrice: string
}

export type TGetProductsQuerySchema = z.infer<typeof getProductsQuerySchema>

export type TPaginationMetaDTO = {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type TPaginatedProductsDTO = {
  data: TProductDTO[]
  meta: TPaginationMetaDTO
}

export type TCreateProductSchema = z.infer<typeof createProductSchema>
export type TUpdateProductSchema = z.infer<typeof updateProductSchema>
