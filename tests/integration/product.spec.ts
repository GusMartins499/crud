import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { app } from '../../src/app.js'
import { db } from '../../src/db/connection.js'
import { productsTable } from '../../src/db/schema/index.js'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Products API', () => {
  test('should create a new product', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/products',
      payload: {
        name: 'Test Product',
        price: 9.99,
      },
    })
    const product = response.json()

    expect(response.statusCode).toBe(201)
    expect(product).toHaveProperty('id')
    expect(product.name).toBe('Test Product')
    expect(product.price).toBe(9.99)
    expect(product.formatPrice).toContain('R$')
    expect(product.formatPrice).toContain('9,99')
  })

  test('should return 400 when creating a product with invalid payload', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/products',
      payload: {
        name: 'abc',
        price: 0,
      },
    })

    expect(response.statusCode).toBe(400)
  })

  test('should list products with pagination metadata', async () => {
    await db.insert(productsTable).values([
      { name: 'Wireless Mouse', price_cents: 1299 },
      { name: 'Desk Lamp', price_cents: 1999 },
      { name: 'Cable Organizer', price_cents: 299 },
    ])

    const response = await app.inject({
      method: 'GET',
      url: '/products?page=1&perPage=2',
    })
    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body).toEqual({
      data: [
        {
          id: expect.any(String),
          name: 'Cable Organizer',
          price: 2.99,
          formatPrice: expect.stringContaining('2,99'),
        },
        {
          id: expect.any(String),
          name: 'Desk Lamp',
          price: 19.99,
          formatPrice: expect.stringContaining('19,99'),
        },
      ],
      meta: {
        page: 1,
        perPage: 2,
        total: 3,
        totalPages: 2,
      },
    })
  })

  test('should return 400 when listing products with invalid query params', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/products?page=0&perPage=101',
    })

    expect(response.statusCode).toBe(400)
  })

  test('should update an existing product', async () => {
    const [product] = await db
      .insert(productsTable)
      .values({
        name: 'Old Product',
        price_cents: 1099,
      })
      .returning()

    const response = await app.inject({
      method: 'PUT',
      url: `/products/${product.id}`,
      payload: {
        name: 'Updated Product',
        price: 29.99,
      },
    })
    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body).toEqual({
      id: product.id,
      name: 'Updated Product',
      price: 29.99,
      formatPrice: expect.stringContaining('29,99'),
    })
  })

  test('should return 404 when updating a non-existent product', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/products/non-existent-id',
      payload: {
        name: 'Updated Product',
      },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({ message: 'Product not found' })
  })

  test('should return 400 when updating a product with an empty payload', async () => {
    const [product] = await db
      .insert(productsTable)
      .values({
        name: 'Existing Product',
        price_cents: 1099,
      })
      .returning()

    const response = await app.inject({
      method: 'PUT',
      url: `/products/${product.id}`,
      payload: {},
    })

    expect(response.statusCode).toBe(400)
  })

  test('should delete an existing product', async () => {
    const [product] = await db
      .insert(productsTable)
      .values({
        name: 'Disposable Product',
        price_cents: 1099,
      })
      .returning()

    const response = await app.inject({
      method: 'DELETE',
      url: `/products/${product.id}`,
    })

    expect(response.statusCode).toBe(204)

    const listResponse = await app.inject({
      method: 'GET',
      url: '/products',
    })

    expect(listResponse.json()).toEqual({
      data: [],
      meta: {
        page: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
      },
    })
  })

  test('should return 204 when deleting a non-existent product', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/products/non-existent-id',
    })

    expect(response.statusCode).toBe(204)
  })
})
