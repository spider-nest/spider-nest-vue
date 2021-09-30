import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import './vite.init'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 9527,
    strictPort: true,
  },
})
