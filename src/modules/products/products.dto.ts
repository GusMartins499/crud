import type { TDrizzleProduct, TProductDTO } from './products-types.js'

export function productToDto(product: TDrizzleProduct): TProductDTO {
  return {
    id: product.id,
    name: product.name,
    price: product.price_cents / 100,
  }
}
