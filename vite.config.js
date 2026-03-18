import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Puerto que espera el backend
    proxy: {
      '/api': {
        target: 'https://backend-dental-bosch-vr8o.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
