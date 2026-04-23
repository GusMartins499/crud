import { randomUUID } from 'node:crypto'
import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const productsTable = sqliteTable(
  'products',
  {
    id: text()
      .$defaultFn(() => randomUUID())
      .primaryKey(),
    name: text().notNull(),
    price_cents: int().notNull(),
  },
  (table) => [index('idx_products_name').on(table.name)],
)
