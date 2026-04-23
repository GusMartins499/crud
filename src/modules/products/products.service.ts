import { asc, count, eq } from 'drizzle-orm'
import { db } from '../../db/connection.js'
import { productsTable } from '../../db/schema/index.js'
import { priceInCents } from '../../utils/price-in-cents.js'
import type {
  TCreateProductSchema,
  TGetProductsQuerySchema,
  TUpdateProductSchema,
} from './products-types.js'

export async function findProductById(id: string) {
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1)

  return product
}

export async function deleteProduct(id: string) {
  await db.delete(productsTable).where(eq(productsTable.id, id))
}

export async function createProduct({ name, price }: TCreateProductSchema) {
  const [product] = await db
    .insert(productsTable)
    .values({
      name,
      price_cents: priceInCents(price),
    })
    .returning()

  return product
}

export async function getProducts({
  page,
  perPage,
}: TGetProductsQuerySchema) {
  const offset = (page - 1) * perPage

  const products = await db
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.name), asc(productsTable.id))
    .limit(perPage)
    .offset(offset)

  const [{ total }] = await db.select({ total: count() }).from(productsTable)

  return {
    products,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  }
}

export async function updateProduct(
  id: string,
  { name, price }: TUpdateProductSchema,
) {
  const [product] = await db
    .update(productsTable)
    .set({
      name,
      price_cents: price !== undefined ? priceInCents(price) : undefined,
    })
    .where(eq(productsTable.id, id))
    .returning()

  return product
}
