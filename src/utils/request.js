import axios from 'axios'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const request = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://yuej.xin'
    : 'http://localhost:8080',
  timeout: 15000,  // 增加超时时间
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求重试配置
const retryDelay = 1000 // 重试延迟时间（毫秒）
const maxRetries = 2    // 最大重试次数

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加重试配置
    config.retryCount = 0
    config.shouldRetry = true

    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      showToast(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res.data
  },
  async error => {
    console.error('Response error:', error)

    // 处理重试逻辑
    const config = error.config
    if (config && config.shouldRetry && config.retryCount < maxRetries) {
      config.retryCount += 1
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      return request(config)
    }

    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      showToast('网络请求超时，请检查网络连接')
    } else if (error.code === 'ERR_NETWORK') {
      showToast('网络连接失败，请检查网络设置')
    } else if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
    } else {
      showToast(error.response?.data?.message || error.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request 