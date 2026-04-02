import { defineConfig } from 'vite'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const environment = (env.VITE_ENVIRONMENT || 'DEVELOPMENT').trim().toUpperCase()
  const selectedEnvironment = environment === 'PRODUCTION' ? 'PRODUCTION' : 'DEVELOPMENT'
  const apiUrl =
    selectedEnvironment === 'PRODUCTION'
      ? env.VITE_API_URL_PRODUCTION?.trim()
      : env.VITE_API_URL_DEVELOPMENT?.trim()

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': apiUrl,
      },
    },
  }
})
