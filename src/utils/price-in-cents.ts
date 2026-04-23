export const priceInCents = (price: number) => Math.round(price * 100)

export const priceFromCents = (priceCents: number) => priceCents / 100

export const formatPrice = (priceInCents: number) => {
  const price = priceFromCents(priceInCents)

  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}
