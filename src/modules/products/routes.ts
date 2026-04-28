import { z } from 'zod'
import type { FastifyTypedInstance } from '../../types/fastify-typed-instance.js'
import {
  createProductHandler,
  deleteProductHandler,
  getProductsHandler,
  updateProductHandler,
} from './products.controller.js'
import {
  createProductSchema,
  getProductsQuerySchema,
  paginatedProductsResponseSchema,
  productIdParamsSchema,
  productResponseSchema,
  updateProductSchema,
} from './products-types.js'

const productTag = ['Products']

export function productsRoutes(app: FastifyTypedInstance) {
  app.post(
    '/products',
    {
      schema: {
        tags: productTag,
        summary: 'Create a product',
        body: createProductSchema,
        response: {
          201: productResponseSchema,
        },
      },
    },
    createProductHandler,
  )

  app.get(
    '/products',
    {
      schema: {
        tags: productTag,
        summary: 'List products',
        querystring: getProductsQuerySchema,
        response: {
          200: paginatedProductsResponseSchema,
        },
      },
    },
    getProductsHandler,
  )

  app.put(
    '/products/:id',
    {
      schema: {
        tags: productTag,
        summary: 'Update a product',
        params: productIdParamsSchema,
        body: updateProductSchema,
        response: {
          200: productResponseSchema,
          404: z
            .object({
              message: z.literal('Product not found'),
            })
            .describe('Product not found response'),
        },
      },
    },
    updateProductHandler,
  )

  app.delete(
    '/products/:id',
    {
      schema: {
        tags: productTag,
        summary: 'Delete a product',
        params: productIdParamsSchema,
        response: {
          204: z.null().describe('Product deleted successfully'),
        },
      },
    },
    deleteProductHandler,
  )
}
