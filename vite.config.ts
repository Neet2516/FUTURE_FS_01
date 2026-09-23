import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawKey = (env.API || env.VITE_GROQ_API_KEY || '').replace(/['"]/g, '').trim()

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GROQ_API_KEY': JSON.stringify(rawKey),
      'import.meta.env.API': JSON.stringify(rawKey),
      'import.meta.env.GROQ_API_KEY': JSON.stringify(rawKey),
    },
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp'],
      },
    },
  }
})
