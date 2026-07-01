import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, 'src/config/index.ts'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@controllers': path.resolve(__dirname, 'src/controllers'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@middleware': path.resolve(__dirname, 'src/middleware'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@validators': path.resolve(__dirname, 'src/validators'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@swagger': path.resolve(__dirname, 'src/swagger.ts'),
    },
  },
})
