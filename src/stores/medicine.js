import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

export const useMedicineStore = defineStore('medicine', () => {
  const reminders = ref([])
  const activeReminders = ref([])

  const addReminder = async (reminder) => {
    try {
      if (!reminder.medicineName || !reminder.dosage || !reminder.frequency) {
        throw new Error('请填写完整信息');
      }

      const reminderData = {
        ...reminder,
        nextRemindTime: new Date().toISOString(),
        status: 'ACTIVE'
      };

      console.log('添加用药提醒:', reminderData);
      const res = await request.post('/api/medicine/reminder', reminderData);
      reminders.value.unshift(res);
      return true;
    } catch (error) {
      console.error('添加用药提醒失败:', error);
      return false;
    }
  }

  const getReminders = async (userId) => {
    try {
      const res = await request.get(`/api/medicine/reminder/${userId}`)
      reminders.value = res
      return true
    } catch (error) {
      return false
    }
  }

  const getActiveReminders = async (userId) => {
    try {
      const res = await request.get(`/api/medicine/reminder/active/${userId}`)
      activeReminders.value = res
      return true
    } catch (error) {
      return false
    }
  }

  const updateReminder = async (reminderId, data) => {
    try {
      await request.put(`/api/medicine/reminder/${reminderId}`, data)
      const index = reminders.value.findIndex(r => r.reminderId === reminderId)
      if (index !== -1) {
        reminders.value[index] = { ...reminders.value[index], ...data }
      }
      return true
    } catch (error) {
      return false
    }
  }

  const deleteReminder = async (reminderId) => {
    try {
      await request.delete(`/api/medicine/reminder/${reminderId}`)
      reminders.value = reminders.value.filter(r => r.reminderId !== reminderId)
      return true
    } catch (error) {
      return false
    }
  }

  return {
    reminders,
    activeReminders,
    addReminder,
    getReminders,
    getActiveReminders,
    updateReminder,
    deleteReminder
  }
}) 