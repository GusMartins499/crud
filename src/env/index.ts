import 'dotenv/config'
import { z } from 'zod/v4'

const envSchema = z.object({
  DB_FILE_NAME: z.string().default('file:local.db'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid enviroment variables', z.treeifyError(_env.error))

  throw new Error('Invalid enviroment variables')
}

export const env = _env.data
