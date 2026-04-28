import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { app } from '../../src/app.js'
import { db } from '../../src/db/connection.js'
import { productsTable } from '../../src/db/schema/index.js'

//let serverUrl: string

beforeAll(async () => {
  await app.ready()
  /*   serverUrl = await app.listen({
    port: 0,
    host: '127.0.0.1',
  }) */
})

afterAll(async () => {
  await app.close()
})

describe('Products API E2E', () => {
  test('should create a new product', async () => {
    const response = await request(app.server).post('/products').send({
      name: 'Test Product',
      price: 9.99,
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Test Product')
    expect(response.body.price).toBe(9.99)
    expect(response.body.formatPrice).toContain('R$')
    expect(response.body.formatPrice).toContain('9,99')
  })

  test('should return 400 when creating a product with invalid payload', async () => {
    const response = await request(app.server).post('/products').send({
      name: 'abc',
      price: 0,
    })

    expect(response.status).toBe(400)
  })

  test('should list products with pagination metadata', async () => {
    await db.insert(productsTable).values([
      { name: 'Wireless Mouse', price_cents: 1299 },
      { name: 'Desk Lamp', price_cents: 1999 },
      { name: 'Cable Organizer', price_cents: 299 },
    ])

    const response = await request(app.server).get('/products?page=1&perPage=2')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
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
    const response = await request(app.server).get(
      '/products?page=0&perPage=101',
    )

    expect(response.status).toBe(400)
  })

  test('should update an existing product', async () => {
    const [product] = await db
      .insert(productsTable)
      .values({
        name: 'Old Product',
        price_cents: 1099,
      })
      .returning()

    const response = await request(app.server)
      .put(`/products/${product.id}`)
      .send({
        name: 'Updated Product',
        price: 29.99,
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: product.id,
      name: 'Updated Product',
      price: 29.99,
      formatPrice: expect.stringContaining('29,99'),
    })
  })

  test('should return 404 when updating a non-existent product', async () => {
    const response = await request(app.server)
      .put('/products/non-existent-id')
      .send({
        name: 'Updated Product',
      })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'Product not found' })
  })

  test('should return 400 when updating a product with an empty payload', async () => {
    const [product] = await db
      .insert(productsTable)
      .values({
        name: 'Existing Product',
        price_cents: 1099,
      })
      .returning()

    const response = await request(app.server)
      .put(`/products/${product.id}`)
      .send({})

    expect(response.status).toBe(400)
  })

  test('should delete an existing product', async () => {
    const [product] = await db
      .insert(productsTable)
      .values({
        name: 'Disposable Product',
        price_cents: 1099,
      })
      .returning()

    const response = await request(app.server).delete(`/products/${product.id}`)

    expect(response.status).toBe(204)

    const listResponse = await request(app.server).get('/products')

    expect(listResponse.body).toEqual({
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
    const response = await request(app.server).delete(
      '/products/non-existent-id',
    )

    expect(response.status).toBe(204)
  })
})
