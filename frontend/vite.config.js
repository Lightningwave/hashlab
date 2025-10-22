import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..']
    }
  },
  base: '/hashlab/',
  build: {
    rollupOptions: {
      external: (id) => {
        // Don't bundle WASM files, they should be loaded at runtime
        return id.includes('pkg/rust_wasm')
      }
    }
  },
  assetsInclude: ['**/*.wasm'],
  define: {
    // This ensures the base path is available at runtime
    'import.meta.env.BASE_URL': JSON.stringify('/hashlab/')
  }
})