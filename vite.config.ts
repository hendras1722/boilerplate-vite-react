import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const targetApiUrl = env.VITE_API_URL || env.API_URL || 'http://localhost:8000'

  return {
    plugins: [
      tailwindcss(),
      TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
      react()
    ],
    server: {
      proxy: {
        '/api': {
          target: targetApiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  }
})
