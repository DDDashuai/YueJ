import axios from 'axios'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'http://121.41.91.14/api'  // 生产环境使用 ECS 公网 IP
    : 'http://localhost:8080/api',    // 开发环境
  timeout: 10000,
  withCredentials: true
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    
    // OPTIONS请求不需要Content-Type
    if (config.method !== 'options') {
      config.headers['Content-Type'] = 'application/json'
    }
    
    return config
  },
  error => {
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
  error => {
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
    }
    showToast(error.response?.data?.message || error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request 