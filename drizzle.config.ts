import { defineConfig } from 'drizzle-kit'
import { env } from './src/env/index.js'

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema/**.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
})
