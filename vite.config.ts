import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { apiServerPlugin } from './vite-plugins/api-server.ts'
import { wsServerPlugin } from './vite-plugins/ws-server.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react({ compiler: true }),
    apiServerPlugin(),
    wsServerPlugin(),
  ],
})
