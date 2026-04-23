import type { FastifyReply, FastifyRequest } from 'fastify'
import { productToDto } from './products.dto.js'
import {
  createProduct,
  getProducts,
  updateProduct,
} from './products.service.js'
import { createProductsSchema, updateProductsSchema } from './products-types.js'

export async function updateProductHandler(
  request: FastifyRequest<{
    Params: { id: string }
    Body: unknown
  }>,
  reply: FastifyReply,
) {
  const { data, error } = updateProductsSchema.safeParse(request.body)
  const { id } = request.params

  if (!data) {
    return reply.status(400).send(error)
  }

  const { name, price } = data
  const product = await updateProduct(id, { name, price })

  return reply.status(201).send(productToDto(product))
}

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
