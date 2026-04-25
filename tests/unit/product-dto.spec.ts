import { describe, expect, it } from 'vitest'
import {
  productsToPaginatedDto,
  productToDto,
} from '../../src/modules/products/products.dto.js'
import type {
  TDrizzleProduct,
  TPaginationMetaDTO,
} from '../../src/modules/products/products-types.js'

describe('ProductDTO', () => {
  it('should maps a drizzle product to the public dto', () => {
    const product: TDrizzleProduct = {
      id: '1',
      name: 'Notebook',
      price_cents: 1999,
    }

    const productDto = productToDto(product)

    expect(productDto.id).toBe('1')
    expect(productDto.name).toBe('Notebook')
    expect(productDto.price).toBe(19.99)
    expect(productDto.formatPrice).toContain('19,99')
  })

  it('should maps a paginated product list preserving the pagination meta', () => {
    const products: TDrizzleProduct[] = [
      {
        id: '1',
        name: 'Notebook',
        price_cents: 1999,
      },
      {
        id: '2',
        name: 'Pen',
        price_cents: 299,
      },
    ]

    const meta: TPaginationMetaDTO = {
      page: 1,
      perPage: 10,
      total: 2,
      totalPages: 1,
    }

    const paginatedDto = productsToPaginatedDto(products, meta)

    expect(paginatedDto.meta).toEqual(meta)
    expect(paginatedDto.data).toHaveLength(2)

    const expected = [
      { id: '1', name: 'Notebook', price: 19.99, formatted: '19,99' },
      { id: '2', name: 'Pen', price: 2.99, formatted: '2,99' },
    ]

    expected.forEach((row, index) => {
      const item = paginatedDto.data[index]
      expect(item.id).toBe(row.id)
      expect(item.name).toBe(row.name)
      expect(item.price).toBe(row.price)
      expect(item.formatPrice).toContain(row.formatted)
    })
  })

  it('should paginate product list', () => {
    const products: TDrizzleProduct[] = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `Product ${i + 1}`,
      price_cents: (i + 1) * 100,
    }))

    const meta: TPaginationMetaDTO = {
      page: 2,
      perPage: 5,
      total: 15,
      totalPages: 3,
    }

    const paginatedDto = productsToPaginatedDto(products.slice(5, 10), meta)

    expect(paginatedDto.meta).toEqual(meta)
    expect(paginatedDto.data).toHaveLength(5)

    const expected = [6, 7, 8, 9, 10]
    expected.forEach((value, index) => {
      const item = paginatedDto.data[index]
      expect(item.id).toBe(String(value))
      expect(item.name).toBe(`Product ${value}`)
      expect(item.price).toBe(value)
      expect(item.formatPrice).toContain(`${value},00`)
    })
  })
})
