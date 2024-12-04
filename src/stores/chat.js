import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

export const useChatStore = defineStore('chat', () => {
  const chatHistory = ref([])
  const chatGroups = ref([])
  const currentGroupId = ref(null)

  const createChatGroup = async () => {
    try {
      const res = await request.post('/api/chat/group/create')
      currentGroupId.value = res.data
      chatHistory.value = []
      return res.data
    } catch (error) {
      console.error('创建聊天组失败:', error)
      throw error
    }
  }

  const getChatGroups = async (userId) => {
    console.log('Getting chat groups for user:', userId)
    try {
      const res = await request.get(`/api/chat/groups/${userId}`)
      console.log('Chat groups response:', res)
      chatGroups.value = res
      return res
    } catch (error) {
      console.error('Error getting chat groups:', error)
      return []
    }
  }

  const getChatHistory = async (userId) => {
    console.log('Getting chat history for user:', userId)
    try {
      const res = await request.get(`/api/chat/history/${userId}`)
      console.log('Chat history response:', res)
      if (res) {
        chatHistory.value = res
        return true
      }
      return false
    } catch (error) {
      console.error('Error getting chat history:', error)
      return false
    }
  }

  const loadGroupChat = async (userId, groupId) => {
    try {
      currentGroupId.value = groupId
      const res = await request.get(`/api/chat/group/${userId}/${groupId}`)
      console.log('加载的聊天记录:', res)
      
      // 检查返回的数据结构
      const chatRecords = res.data || res
      if (!Array.isArray(chatRecords)) {
        throw new Error('无效的聊天记录格式')
      }

      // 将每条记录转换为聊天消息格式
      const messages = []
      chatRecords.forEach(chat => {
        // 添加用户消息
        if (chat.message) {
          messages.push({
            type: 'user',
            message: chat.message,
            createdAt: chat.createdAt,
            chatGroupId: chat.chatGroupId
          })
        }
        
        // 添加AI回复
        if (chat.response) {
          messages.push({
            type: 'ai',
            response: chat.response,
            createdAt: chat.createdAt,
            chatGroupId: chat.chatGroupId,
            loading: false
          })
        }
      })
      
      // 按时间顺序排序
      messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      
      // 更新聊天历史
      chatHistory.value = messages
      console.log('处理后的聊天记录:', messages)
      
      return messages
    } catch (error) {
      console.error('加载聊天记录失败:', error)
      throw error
    }
  }

  const sendMessage = async (message) => {
    console.log('Sending message:', message)
    let loadingMessage = null
    
    try {
      if (!currentGroupId.value) {
        console.log('Creating new chat group...')
        currentGroupId.value = await createChatGroup()
        console.log('Created chat group:', currentGroupId.value)
      }
      message.chatGroupId = currentGroupId.value
      
      if (!message.userId) {
        throw new Error('用户未登录')
      }

      // 添加用户消息到历史记录
      const userMessage = {
        type: 'user',
        message: message.message,
        createdAt: new Date().toISOString(),
        chatGroupId: currentGroupId.value
      }
      chatHistory.value.push(userMessage)
      
      // 添加loading消息
      loadingMessage = {
        type: 'ai',
        loading: true,
        message: 'AI正在思考...'
      }
      chatHistory.value.push(loadingMessage)
      
      // 发送请求
      const res = await request.post('/api/chat/text', {
        ...message,
        chatGroupId: currentGroupId.value
      })
      
      console.log('API response:', res)
      
      // 检查响应格式
      if (!res) {
        throw new Error('Empty response')
      }
      
      // 更新AI回复
      const index = chatHistory.value.findIndex(msg => msg === loadingMessage)
      if (index !== -1) {
        // 根据实际返回的数据结构构造消息对象
        chatHistory.value[index] = {
          type: 'ai',
          message: res.message || '',
          response: res.response || '',  // 使用 response 字段作为 AI 回复
          createdAt: res.createdAt || new Date().toISOString(),
          loading: false,
          chatGroupId: currentGroupId.value
        }
      }
      
      return res
    } catch (error) {
      console.error('Send message error:', error)
      // 移除loading消息
      if (loadingMessage) {
        const index = chatHistory.value.findIndex(msg => msg === loadingMessage)
        if (index !== -1) {
          chatHistory.value.splice(index, 1)
        }
      }
      throw error
    }
  }

  const sendImage = async (formData) => {
    try {
      const userId = userStore.user?.userId;
      if (!userId) {
        throw new Error('用户未登录');
      }

      const loadingMessage = {
        type: 'ai',
        loading: true
      }
      chatHistory.value.push(loadingMessage)
      
      formData.append('userId', userId);
      const res = await request.post('/api/chat/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const index = chatHistory.value.indexOf(loadingMessage)
      if (index !== -1) {
        chatHistory.value[index] = {
          ...res,
          type: 'ai',
          loading: false
        }
      }
      
      return res
    } catch (error) {
      chatHistory.value = chatHistory.value.filter(msg => msg !== loadingMessage)
      throw error
    }
  }

  return {
    chatHistory,
    chatGroups,
    currentGroupId,
    createChatGroup,
    getChatGroups,
    getChatHistory,
    loadGroupChat,
    sendMessage,
    sendImage
  }
}) 