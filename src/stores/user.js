import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref('')

  const login = async (username, password) => {
    try {
      if (!username || !password) {
        throw new Error('用户名和密码不能为空');
      }
      
      const res = await request.post('/api/user/login', {
        username,
        password
      });
      
      if (res.user && res.token) {
        user.value = res.user;
        token.value = res.token;
        localStorage.setItem('token', res.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }

  const register = async (data) => {
    try {
      if (!data.username || !data.password) {
        throw new Error('用户名和密码不能为空');
      }
      
      const registerData = {
        username: data.username,
        password: data.password
      };
      
      if (data.email) {
        registerData.email = data.email;
      }
      if (data.phone) {
        registerData.phone = data.phone;
      }
      
      await request.post('/api/user/register', registerData);
      return true;
    } catch (error) {
      return false;
    }
  }

  const getUserInfo = async () => {
    try {
      const res = await request.get('/api/user/info')
      user.value = res
      return true
    } catch (error) {
      return false
    }
  }

  const updateUserInfo = async (data) => {
    try {
      await request.put('/api/user/info', data)
      return true
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken && !token.value) {
      token.value = savedToken
      return await getUserInfo()
    }
    return !!token.value
  }

  return {
    user,
    token,
    login,
    register,
    getUserInfo,
    updateUserInfo,
    logout,
    checkAuth
  }
}) 