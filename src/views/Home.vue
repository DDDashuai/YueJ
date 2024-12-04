<template>
  <div class="home-page">
    <div class="header">
      <div class="user-info">
        <AvatarLetter
          :username="userStore.user?.username || '?'"
          :size="60"
        />
        <div class="user-detail">
          <h3 class="username">{{ userStore.user?.username || '未登录' }}</h3>
          <p class="welcome">欢迎使用健康管理平台</p>
        </div>
      </div>
    </div>
    
    <div class="health-overview card">
      <div class="card-header">
        <h3>今日健康概览</h3>
        <van-button size="small" type="primary" plain @click="toHealthData">
          查看详情
        </van-button>
      </div>
      
      <div class="health-grid">
        <div class="health-item" v-for="item in healthData" :key="item.type">
          <span class="item-label">{{ item.label }}</span>
          <span class="item-value" :class="item.status">{{ item.value || '--' }}</span>
          <span class="item-unit">{{ item.unit }}</span>
        </div>
      </div>
    </div>
    
    <div class="medicine-reminders card">
      <div class="card-header">
        <h3>用药提醒</h3>
        <van-button size="small" type="primary" plain @click="toMedicineReminder">
          全部提醒
        </van-button>
      </div>
      
      <div class="reminder-list">
        <div v-if="activeReminders.length === 0" class="empty-tip">
          暂无用药提醒
        </div>
        <div
          v-else
          v-for="reminder in activeReminders"
          :key="reminder.reminderId"
          class="reminder-item"
        >
          <div class="reminder-time">
            {{ formatDateTime(reminder.nextRemindTime) }}
          </div>
          <div class="reminder-content">
            <h4>{{ reminder.medicineName }}</h4>
            <p>{{ reminder.dosage }}</p>
          </div>
          <van-button
            size="small"
            type="primary"
            @click="markAsTaken(reminder.reminderId)"
          >
            已服用
          </van-button>
        </div>
      </div>
    </div>
   
    <div class="medicine-reminders card">
      <div class="card-header">
        <span class="title">最近会诊</span>
        <van-button 
          size="small" 
          plain 
          round 
          @click="goToChat"
        >
          开始问诊
        </van-button>
      </div>
      
      <div class="chat-list">
        <van-skeleton 
          title 
          :row="2" 
          v-if="loading"
          :loading="loading"
        />
        <template v-else>
          <div 
            v-for="chat in recentChats" 
            :key="chat.chat_group_id" 
            class="chat-item"
            @click="openChatDetail(chat)"
          >
            <div class="chat-icon">
              <van-icon 
                :name="chat.conversationType === 'western' ? 'cluster-o' : 'flower-o'" 
                size="24"
              />
            </div>
            <div class="chat-info">
              <div class="chat-time">{{ formatDate(chat.created_at) }}</div>
              <div class="chat-preview">{{ chat.last_message }}</div>
            </div>
            <van-icon name="arrow" class="arrow-icon" />
          </div>
          
          <div v-if="recentChats.length === 0" class="empty-state">
            暂无会诊记录
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMedicineStore } from '@/stores/medicine'
import { useHealthStore } from '@/stores/health'
import { useChatStore } from '@/stores/chat'
import { formatDateTime, formatDate } from '@/utils/date'
import { showToast } from 'vant'
import AvatarLetter from '@/components/AvatarLetter.vue'

const router = useRouter()
const userStore = useUserStore()
const medicineStore = useMedicineStore()
const healthStore = useHealthStore()
const chatStore = useChatStore()

const healthData = ref([
  { type: 'bloodPressure', label: '血压', value: null, unit: 'mmHg' },
  { type: 'heartRate', label: '心率', value: null, unit: '次/分' },
  { type: 'bloodSugar', label: '血糖', value: null, unit: 'mmol/L' },
  { type: 'weight', label: '体重', value: null, unit: 'kg' }
])

const activeReminders = ref([])
const chatHistory = ref([])
const loading = ref(false)
const recentChats = ref([])

onMounted(async () => {
  console.log('Initial token:', userStore.token)
  if (userStore.token) {
    await userStore.getUserInfo()
    console.log('User info loaded:', userStore.user)
  } else {
    console.warn('No token found')
    return
  }

  if (userStore.user?.userId) {
    console.log('Starting to load all data for user:', userStore.user.userId)
    try {
      const healthSuccess = await loadHealthData()
      console.log('Health data loaded:', healthSuccess)

      const reminderSuccess = await loadReminders()
      console.log('Reminders loaded:', reminderSuccess)

      const chatSuccess = await loadChatHistory()
      console.log('Chat history loaded:', chatSuccess)

      const recentChatsSuccess = await loadRecentChats()
      console.log('Recent chats loaded:', recentChatsSuccess)

      console.log('All data load results:', {
        health: healthSuccess,
        reminders: reminderSuccess,
        chat: chatSuccess,
        recentChats: recentChatsSuccess
      })
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }
})

const loadHealthData = async () => {
  console.log('loadHealthData called with userId:', userStore.user?.userId)
  if (!userStore.user?.userId) {
    console.warn('No userId available in loadHealthData')
    return false
  }

  try {
    const success = await healthStore.getLatestHealth(userStore.user.userId)
    console.log('getLatestHealth result:', success)
    if (success && healthStore.healthData) {
      console.log('Updating health display with:', healthStore.healthData)
      updateHealthDisplay(healthStore.healthData)
      return true
    }
    return false
  } catch (error) {
    console.error('Health data load error:', error)
    return false
  }
}

const loadReminders = async () => {
  console.log('Loading reminders for user:', userStore.user?.userId)
  if (!userStore.user?.userId) {
    console.warn('No userId available for loading reminders')
    return false
  }

  try {
    const success = await medicineStore.getActiveReminders(userStore.user.userId)
    console.log('Active reminders response:', success)
    if (success) {
      console.log('Active reminders data:', medicineStore.activeReminders)
      activeReminders.value = medicineStore.activeReminders
      return true
    }
    return false
  } catch (error) {
    console.error('Error loading reminders:', error)
    return false
  }
}

const loadChatHistory = async () => {
  console.log('Loading chat history for user:', userStore.user?.userId)
  if (!userStore.user?.userId) {
    console.warn('No userId available for loading chat history')
    return false
  }

  try {
    const success = await chatStore.getChatHistory(userStore.user.userId)
    console.log('Chat history response:', success)
    if (success) {
      console.log('Chat history data:', chatStore.chatHistory)
      chatHistory.value = chatStore.chatHistory
      return true
    }
    return false
  } catch (error) {
    console.error('Error loading chat history:', error)
    return false
  }
}

const loadRecentChats = async () => {
  console.log('Loading recent chats for user:', userStore.user?.userId)
  if (!userStore.user?.userId) {
    console.warn('No userId available for loading recent chats')
    return false
  }
  
  loading.value = true
  try {
    const chats = await chatStore.getChatGroups(userStore.user.userId)
    console.log('Recent chats response:', chats)
    if (chats && chats.length > 0) {
      recentChats.value = chats.slice(0, 3)
      console.log('Recent chats data:', recentChats.value)
      return true
    }
    return false
  } catch (error) {
    console.error('Error loading recent chats:', error)
    return false
  } finally {
    loading.value = false
  }
}

const updateHealthDisplay = (data) => {
  healthData.value = healthData.value.map(item => {
    const value = data[item.type]
    return {
      ...item,
      value: value || '--'
    }
  })
}

const markAsTaken = async (reminderId) => {
  const success = await medicineStore.updateReminder(reminderId, {
    status: 'COMPLETED'
  })
  if (success) {
    await loadReminders()
  }
}

// 页面跳转
const toHealthData = () => router.push('/YueJ/health')
const toMedicineReminder = () => router.push('/YueJ/medicine')
const toChat = () => router.push('/YueJ/chat')

// 打开聊天详情
const openChatDetail = async (chat) => {
  try {
    await chatStore.loadGroupChat(userStore.user.userId, chat.chat_group_id)
    router.push('/chat')
  } catch (error) {
    showToast('加载聊天记录失败')
  }
}

// 跳转到问诊页面
const goToChat = () => {
  router.push('/chat')
}
</script>

<style scoped>
.home-page {
  padding: 20px;
  min-height: 100vh;
  background: var(--background-color);
  margin-bottom: 100px;
}

.header {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-detail {
  margin-left: 16px;
  flex: 1;
}

.username {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  color: var(--text-color);
}

.welcome {
  font-size: 14px;
  color: var(--text-color-light);
  margin: 4px 0 0;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 16px;
  margin: 0;
}

.health-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.health-item {
  padding: 12px;
  background: var(--background-color);
  border-radius: 8px;
  text-align: center;
}

.item-label {
  font-size: 14px;
  color: var(--text-color-light);
}

.item-value {
  display: block;
  font-size: 20px;
  font-weight: 500;
  margin: 4px 0;
}

.item-unit {
  font-size: 12px;
  color: var(--text-color-light);
}

.reminder-list,
.chat-list {
  max-height: 300px;
  overflow-y: auto;
}

.reminder-item,
.chat-item {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.reminder-time,
.chat-time {
  font-size: 12px;
  color: var(--text-color-light);
}

.reminder-content,
.chat-content {
  margin: 8px 0;
}

.reminder-content h4 {
  margin: 0;
  font-size: 15px;
}

.reminder-content p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-color-light);
}

.chat-content .question {
  margin: 4px 0;
  font-size: 14px;
}

.chat-content .answer {
  margin: 4px 0;
  font-size: 14px;
  color: var(--text-color-light);
}

.empty-tip {
  text-align: center;
  padding: 20px;
  color: var(--text-color-light);
}

.recent-chats {
  margin: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:active {
  background: #f0f0f0;
}

.chat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 20px;
  margin-right: 12px;
}

.chat-icon .van-icon {
  color: var(--primary-color);
}

.chat-info {
  flex: 1;
  overflow: hidden;
}

.chat-time {
  font-size: 12px;
  color: var(--text-color-light);
  margin-bottom: 4px;
}

.chat-preview {
  font-size: 14px;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  color: #999;
  margin-left: 8px;
}

.empty-state {
  text-align: center;
  color: var(--text-color-light);
  padding: 24px 0;
}
</style> 