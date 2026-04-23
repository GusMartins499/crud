import { count } from 'drizzle-orm'
import { db } from './connection.js'
import { productsTable } from './schema/index.js'

const seedProducts = [
  { name: 'Mechanical Keyboard', price_cents: 35990 },
  { name: 'Wireless Mouse', price_cents: 12990 },
  { name: '4K Monitor', price_cents: 189990 },
  { name: 'USB-C Dock', price_cents: 49990 },
  { name: 'Notebook Stand', price_cents: 8990 },
  { name: 'Ergonomic Chair', price_cents: 249990 },
  { name: 'Desk Lamp', price_cents: 19990 },
  { name: 'External SSD', price_cents: 99990 },
  { name: 'Webcam', price_cents: 59990 },
  { name: 'Noise-Cancelling Headphones', price_cents: 149990 },
  { name: 'Gaming Chair', price_cents: 299990 },
  { name: 'Smartphone Stand', price_cents: 1490 },
  { name: 'Cable Organizer', price_cents: 2990 },
  { name: 'Laptop Sleeve', price_cents: 1990 },
  { name: 'Bluetooth Speaker', price_cents: 49990 },
]

async function seed() {
  const [{ total }] = await db.select({ total: count() }).from(productsTable)

  if (total > 0) {
    console.log('Seed skipped: products table already has data.')
    return
  }

  await db.insert(productsTable).values(seedProducts)

  console.log(`Seed completed: inserted ${seedProducts.length} products.`)
}

seed().catch((error) => {
  console.error('Seed failed.', error)
  process.exitCode = 1
})
