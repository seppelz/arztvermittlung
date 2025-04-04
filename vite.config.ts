import { fileURLToPath, URL } from 'node:url'

import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Define a type for manual chunks function
type ManualChunksFunction = (id: string) => string | undefined;

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    proxy: {
      // Proxy API requests to local development server
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  build: {
    // Generate sourcemaps for production build
    sourcemap: true,
    // Improve chunk loading strategy for production
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Optimize chunk file output
        manualChunks: ((id: string): string | undefined => {
          // Create vendor chunk for node_modules
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia')) {
              return 'vendor-framework'
            }
            if (id.includes('element-plus')) {
              return 'vendor-ui'
            }
            return 'vendor'
          }
          // Create separate chunks for big modules
          if (id.includes('/src/views/')) {
            return 'views'
          }
          // Create separate chunk for component library
          if (id.includes('/src/components/')) {
            return 'components'
          }
          // Allow code splitting for services
          if (id.includes('/src/services/')) {
            return 'services'
          }
          return undefined;
        }) as ManualChunksFunction
      }
    }
  }
} as UserConfig)
