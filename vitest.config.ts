import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['tests/**/*.{test,spec}.ts'],
      exclude: ['src/**/*.d.ts'],
    },
  },
})
