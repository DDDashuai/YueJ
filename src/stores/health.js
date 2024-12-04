import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import { useUserStore } from '@/stores/user'

export const useHealthStore = defineStore('health', () => {
  const userStore = useUserStore()
  const healthData = ref(null)
  const healthHistory = ref([])

  const addHealthData = async (data) => {
    try {
      if (!userStore.user?.userId) {
        throw new Error('用户未登录')
      }

      const healthData = {
        ...data,
        userId: userStore.user.userId
      }

      const res = await request.post('/api/health', healthData)
      healthData.value = res
      return true
    } catch (error) {
      console.error('添加健康数据失败:', error)
      return false
    }
  }

  const getLatestHealth = async (userId) => {
    try {
      if (!userId) {
        throw new Error('用户ID不能为空')
      }
      const res = await request.get(`/api/health/latest/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        }
      })
      if (res) {
        healthData.value = res
        console.log('最新健康数据:', res)
      }
      return true
    } catch (error) {
      console.error('获取最新健康数据失败:', error)
      return false
    }
  }

  const getHealthHistory = async (userId) => {
    try {
      if (!userId) {
        throw new Error('用户ID不能为空')
      }
      const res = await request.get(`/api/health/user/${userId}`)
      if (res) {
        healthHistory.value = res
        console.log('健康记录历史:', res)
      }
      return true
    } catch (error) {
      console.error('获取健康记录失败:', error)
      return false
    }
  }

  const deleteHealthRecord = async (id) => {
    try {
      if (!id) {
        throw new Error('记录ID不能为空');
      }
      await request.delete(`/api/health/${id}`);
      console.log('删除健康记录:', id);  // 添加日志
      return true;
    } catch (error) {
      console.error('删除健康记录失败:', error);
      return false;
    }
  }

  return {
    healthData,
    healthHistory,
    addHealthData,
    getLatestHealth,
    getHealthHistory,
    deleteHealthRecord
  }
}) 