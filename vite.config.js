import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // Generate sourcemaps for production build
    sourcemap: true,
    // Improve chunk loading strategy for production
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Optimieren Sie die Chunk-Dateiausgabe
        manualChunks: {
          'vendor': [
            'vue',
            'vue-router'
          ]
        }
      }
    }
  }
})
