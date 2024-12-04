import axios from 'axios'

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
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default service 