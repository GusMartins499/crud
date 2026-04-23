import { db } from '../../db/connection.js'
import { productsTable } from '../../db/schema/index.js'
import type { TCreateProductsSchema } from './products-types.js'

export async function createProduct({ name, price }: TCreateProductsSchema) {
  const priceInCents = Math.round(price * 100)

  const [product] = await db
    .insert(productsTable)
    .values({
      name,
      price_cents: priceInCents,
    })
    .returning()

  return product
}
