import type { FastifyReply, FastifyRequest } from 'fastify'
import { productsToPaginatedDto, productToDto } from './products.dto.js'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from './products.service.js'
import {
  createProductSchema,
  getProductsQuerySchema,
  type TGetProductsQuerySchema,
  updateProductSchema,
} from './products-types.js'

export async function deleteProductHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string }

  await deleteProduct(id)

  return reply.status(204).send()
}

export async function updateProductHandler(
  request: FastifyRequest<{
    Params: { id: string }
    Body: unknown
  }>,
  reply: FastifyReply,
) {
  const { data, error } = updateProductSchema.safeParse(request.body)
  const { id } = request.params

  if (!data) {
    return reply.status(400).send(error)
  }

  const { name, price } = data
  const product = await updateProduct(id, { name, price })

  if (!product) {
    return reply.status(404).send({ message: 'Product not found' })
  }

  return reply.status(200).send(productToDto(product))
}

export async function createProductHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { data, error } = createProductSchema.safeParse(request.body)

  if (!data) {
    return reply.status(400).send(error)
  }

  const { name, price } = data
  const product = await createProduct({ name, price })

  return reply.status(201).send(productToDto(product))
}

export async function getProductsHandler(
  request: FastifyRequest<{
    Querystring: TGetProductsQuerySchema
  }>,
  reply: FastifyReply,
) {
  const { data, error } = getProductsQuerySchema.safeParse(request.query)

  if (!data) {
    return reply.status(400).send(error)
  }

  const { products, meta } = await getProducts(data)

  return reply.send(productsToPaginatedDto(products, meta))
}
