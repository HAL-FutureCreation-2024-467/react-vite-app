import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    watch: {
      usePolling: true
    }
  },
  plugins: [react()],
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/index.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      '@/': path.join(__dirname, './src/'),
    },
  },
})
