import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
//import { resolve, dirname } from 'path'
import { resolve } from 'path'

console.log('dir:', __dirname)

// const moduleURL = new URL(import.meta.url)
// const __dirname = dirname(moduleURL.pathname)

// https://vitejs.dev/config/
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
