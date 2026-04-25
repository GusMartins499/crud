export const priceInCents = (price: number) =>
  Math.round((price + Number.EPSILON) * 100)

export const priceFromCents = (priceCents: number) => priceCents / 100

const brlCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const formatPrice = (priceInCents: number) => {
  const price = priceFromCents(priceInCents)

  return brlCurrencyFormatter.format(price)
}
