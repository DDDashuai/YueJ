import axios from 'axios'
<<<<<<< HEAD

// 创建axios实例
const service = axios.create({
  // 根据环境变量设置baseURL
  baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:8080'  // 本地开发环境
    : 'https://api.your-domain.com',  // 生产环境
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
=======
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://yuej.xin'
    : 'http://localhost:8080',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
>>>>>>> e957888 (Initial commit)
    }
    return config
  },
  error => {
<<<<<<< HEAD
    console.log(error)
=======
    console.error('Request error:', error)
>>>>>>> e957888 (Initial commit)
    return Promise.reject(error)
  }
)

<<<<<<< HEAD
export default service 
=======
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
    console.error('Response error:', error)
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      showToast('请求超时，请重试')
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
>>>>>>> e957888 (Initial commit)
