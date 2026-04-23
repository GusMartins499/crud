import { formatPrice, priceFromCents } from '../../utils/price-in-cents.js'
import type { TDrizzleProduct, TProductDTO } from './products-types.js'

export function productToDto(product: TDrizzleProduct): TProductDTO {
  return {
    id: product.id,
    name: product.name,
    price: priceFromCents(product.price_cents),
    formatPrice: formatPrice(product.price_cents),
  }
}
