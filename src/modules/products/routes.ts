import type { FastifyInstance } from 'fastify'
import {
  createProductHandler,
  deleteProductHandler,
  getProductsHandler,
  updateProductHandler,
} from './products.controller.js'

export function productsRoutes(app: FastifyInstance) {
  app.post('/products', createProductHandler)
  app.get('/products', getProductsHandler)
  app.put('/products/:id', updateProductHandler)
  app.delete('/products/:id', deleteProductHandler)
}
