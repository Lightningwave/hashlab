import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..']
    }
  },
  // Use '/hashlab/' for GitHub Pages (production), '/' for local dev
  base: mode === 'production' ? '/hashlab/' : '/',
  resolve: {
    alias: {
      '@pkg': path.resolve(__dirname, '../pkg')
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep WASM files in a pkg directory structure
          if (assetInfo.name && assetInfo.name.endsWith('.wasm')) {
            return 'pkg/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    copyPublicDir: true
  },
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['@pkg/rust_wasm.js']
  }
}))