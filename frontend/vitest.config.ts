import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
    root: __dirname,
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s+(x)'],
  },
})