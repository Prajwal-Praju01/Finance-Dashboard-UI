import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('recharts')) {
            return 'vendor-charts'
          }

          if (id.includes('framer-motion')) {
            return 'vendor-motion'
          }

          if (id.includes('zustand') || id.includes('date-fns') || id.includes('clsx')) {
            return 'vendor-utils'
          }
        },
      },
    },
  },
})
