import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite que Docker exponga el puerto
    port: 5173,
    watch: {
      usePolling: true, // ESTO ES LO IMPORTANTE: obliga a Vite a revisar cambios manualmente
    },
  },
})