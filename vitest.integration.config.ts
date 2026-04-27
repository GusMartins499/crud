import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      DB_FILE_NAME: 'file:test.db',
    },
    globalSetup: ['tests/global-setup.ts'],
    setupFiles: ['tests/setup.ts'],
    include: ['tests/integration/**/*.spec.ts'],
  },
})
