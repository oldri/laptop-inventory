import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Listen on all network interfaces
    port: 5173,
    watch: {
      usePolling: true  // Needed for Docker volumes on some systems
    },
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true
      }
    }
  }
})