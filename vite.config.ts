import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar } from '@quasar/vite-plugin'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    quasar({
      sassVariables: 'src/styles/quasar-variables.scss',
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: ` @import "@/styles/variables.scss";` },
      sass: {},
    },
  },

  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
})
