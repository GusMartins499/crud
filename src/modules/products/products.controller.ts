import type { FastifyReply, FastifyRequest } from 'fastify'
import { productToDto } from './products.dto.js'
import { createProduct, getProducts } from './products.service.js'
import { createProductsSchema } from './products-types.js'

export async function createProductHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { data, error } = createProductsSchema.safeParse(request.body)

  if (!data) {
    return reply.status(400).send(error)
  }

  const { name, price } = data
  const product = await createProduct({ name, price })

  return reply.status(201).send(productToDto(product))
}

export async function getProductsHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const products = await getProducts()
  const productsDto = products.map(productToDto)

  return reply.send(productsDto)
}
