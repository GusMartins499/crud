import { eq } from 'drizzle-orm'
import { db } from '../../db/connection.js'
import { productsTable } from '../../db/schema/index.js'
import { priceInCents } from '../../utils/price-in-cents.js'
import type {
  TCreateProductsSchema,
  TUpdateProductsSchema,
} from './products-types.js'

export async function createProduct({ name, price }: TCreateProductsSchema) {
  const [product] = await db
    .insert(productsTable)
    .values({
      name,
      price_cents: priceInCents(price),
    })
    .returning()

  return product
}

export async function getProducts() {
  const products = await db.select().from(productsTable)

  return products
}

export async function updateProduct(
  id: string,
  { name, price }: TUpdateProductsSchema,
) {
  const [product] = await db
    .update(productsTable)
    .set({
      name,
      price_cents: price ? priceInCents(price) : undefined,
    })
    .where(eq(productsTable.id, id))
    .returning()

  return product
}
