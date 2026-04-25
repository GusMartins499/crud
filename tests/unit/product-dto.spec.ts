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

    const dto = productToDto(product)

    expect(dto.id).toBe('1')
    expect(dto.name).toBe('Notebook')
    expect(dto.price).toBe(19.99)
    expect(dto.formatPrice).toContain('19,99')
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

    expect(paginatedDto.data[0].id).toBe('1')
    expect(paginatedDto.data[0].name).toBe('Notebook')
    expect(paginatedDto.data[0].price).toBe(19.99)
    expect(paginatedDto.data[0].formatPrice).toContain('19,99')

    expect(paginatedDto.data[1].id).toBe('2')
    expect(paginatedDto.data[1].name).toBe('Pen')
    expect(paginatedDto.data[1].price).toBe(2.99)
    expect(paginatedDto.data[1].formatPrice).toContain('2,99')
  })

  it('should paginted product list', () => {
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

    expect(paginatedDto.data[0].id).toBe('6')
    expect(paginatedDto.data[0].name).toBe('Product 6')
    expect(paginatedDto.data[0].price).toBe(6)
    expect(paginatedDto.data[0].formatPrice).toContain('6,00')

    expect(paginatedDto.data[1].id).toBe('7')
    expect(paginatedDto.data[1].name).toBe('Product 7')
    expect(paginatedDto.data[1].price).toBe(7)
    expect(paginatedDto.data[1].formatPrice).toContain('7,00')

    expect(paginatedDto.data[2].id).toBe('8')
    expect(paginatedDto.data[2].name).toBe('Product 8')
    expect(paginatedDto.data[2].price).toBe(8)
    expect(paginatedDto.data[2].formatPrice).toContain('8,00')

    expect(paginatedDto.data[3].id).toBe('9')
    expect(paginatedDto.data[3].name).toBe('Product 9')
    expect(paginatedDto.data[3].price).toBe(9)
    expect(paginatedDto.data[3].formatPrice).toContain('9,00')

    expect(paginatedDto.data[4].id).toBe('10')
    expect(paginatedDto.data[4].name).toBe('Product 10')
    expect(paginatedDto.data[4].price).toBe(10)
    expect(paginatedDto.data[4].formatPrice).toContain('10,00')
  })
})
