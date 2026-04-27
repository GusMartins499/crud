import fs from 'node:fs'
import path from 'node:path'
import { config } from 'dotenv'
import { envSchema } from '../src/env/index.js'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

export async function dropTestDatabase() {
  const dbFilePath = path.resolve(
    process.cwd(),
    env.DB_FILE_NAME.replace('file:', ''),
  )
  if (fs.existsSync(dbFilePath)) {
    fs.unlinkSync(dbFilePath)
  }
}

export async function createTestDatabase() {
  const dbFilePath = path.resolve(
    process.cwd(),
    env.DB_FILE_NAME.replace('file:', ''),
  )
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, '')
  }
}
