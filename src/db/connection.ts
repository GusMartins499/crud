import { drizzle } from 'drizzle-orm/libsql'
import { env } from '../env/index.js'

export const db = drizzle(env.DB_FILE_NAME)
