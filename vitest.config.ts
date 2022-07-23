import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { quasar } from '@quasar/vite-plugin'

export default {
  plugins: [
    vue(),
    quasar({
      sassVariables: 'src/styles/quasar-variables.scss',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: 'verbose',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}
