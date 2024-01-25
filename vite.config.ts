import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    strictPort: true,
    cors:true,
    host:'0.0.0.0',
    proxy: {
      "^/api": {
        target:"http://121.199.73.156:8888/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 去除请求路径中的 '/api' 前缀
      }
    }
  },
  base: './'
})
