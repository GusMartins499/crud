import type { FastifyInstance } from 'fastify'
import { createProductHandler } from './products.controller.js'

export function productsRoutes(app: FastifyInstance) {
  app.post('/products', createProductHandler)
}
