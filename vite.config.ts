import path from 'path'
import react from '@vitejs/plugin-react'
import vercel from 'vite-plugin-vercel'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: process.env.PORT as unknown as number,
  },
  plugins: [react(), vercel()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  assetsInclude: [
    '**/*.mp3', '**/*.wav', '**/*.ogg',
  ]
})
