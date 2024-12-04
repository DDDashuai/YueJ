import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [vue()],
    base: env.VITE_BASE_URL,
    server: {
      port: 3000,
      proxy: mode === 'local' ? {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true
        }
      } : {}
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
})
