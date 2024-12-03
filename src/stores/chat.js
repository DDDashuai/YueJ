import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

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
    const res = await request.get(`/api/chat/groups/${userId}`)
    chatGroups.value = res
    return res
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
    if (!currentGroupId.value) {
      currentGroupId.value = await createChatGroup()
    }
    message.chatGroupId = currentGroupId.value
    
    try {
      if (!message.userId) {
        throw new Error('用户未登录');
      }

      // 添加用户消息
      chatHistory.value.push({
        type: 'user',
        message: message.message,
        createdAt: new Date().toISOString(),
        chatGroupId: currentGroupId.value
      })
      
      // 添加loading消息
      const loadingMessage = {
        type: 'ai',
        loading: true
      }
      chatHistory.value.push(loadingMessage)
      
      // 发送请求
      const res = await request.post('/api/chat/text', message)
      
      // 更新AI回复
      const index = chatHistory.value.indexOf(loadingMessage)
      if (index !== -1) {
        chatHistory.value[index] = {
          type: 'ai',
          message: res.data.message,
          response: res.data.response,
          createdAt: res.data.createdAt,
          loading: false,
          chatGroupId: currentGroupId.value
        }
      }
      
      return res
    } catch (error) {
      chatHistory.value = chatHistory.value.filter(msg => msg !== loadingMessage)
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
    loadGroupChat,
    sendMessage,
    sendImage
  }
}) 