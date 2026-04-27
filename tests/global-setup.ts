import { execSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { config } from 'dotenv'

// lê o .env.test diretamente, já que o globalSetup
// roda em um worker isolado sem acesso ao vitest.config env
const { parsed } = config({ path: '.env.test' })
const DB_FILE_NAME = parsed?.DB_FILE_NAME ?? 'file:test.db'
const DB_FILE = DB_FILE_NAME.replace('file:', '')

export async function setup() {
  execSync('pnpm run db:migrate', {
    stdio: 'inherit',
    env: { ...process.env, DB_FILE_NAME },
  })
}

export async function teardown() {
  if (existsSync(DB_FILE)) {
    rmSync(DB_FILE)
  }
}
