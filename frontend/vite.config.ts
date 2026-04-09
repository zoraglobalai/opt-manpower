import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:8000'
  const shouldUseProxy = env.VITE_USE_PROXY
    ? env.VITE_USE_PROXY === 'true'
    : mode === 'development'

  const proxy = shouldUseProxy
    ? {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/media': {
          target: proxyTarget,
          changeOrigin: true,
        },
      }
    : undefined

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: ['optimusglobalhr.com', 'www.optimusglobalhr.com'],
      proxy,
    },
    preview: {
      allowedHosts: ['optimusglobalhr.com', 'www.optimusglobalhr.com'],
    },
  }
})
