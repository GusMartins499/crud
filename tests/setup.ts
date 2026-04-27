import { beforeEach } from 'vitest'
import { db } from '../src/db/connection.js'
import { productsTable } from '../src/db/schema/index.js'

beforeEach(async () => {
  await db.delete(productsTable)
})
