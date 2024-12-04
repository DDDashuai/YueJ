<template>
  <div class="chat-page">
    <van-nav-bar 
      title="智能问诊"
      left-arrow
      right-text="历史"
      @click-left="onClickLeft"
      @click-right="showHistory"
      class="chat-nav"
    />
    
    <div class="chat-content" ref="chatContainer">
      <div class="message-list">
        <div class="message" :class="{'message-left': message.type === 'ai', 'message-right': message.type === 'user'}" v-for="message in chatStore.chatHistory" :key="message.createdAt">
          <div v-if="message.type === 'ai'" class="avatar">
            <AvatarLetter username="AI" :size="40" />
          </div>
          <div class="message-content" :class="message.type">
            <template v-if="message.loading">
              <div class="typing">
                <van-loading type="spinner" size="20" />
                {{ message.message }}
              </div>
            </template>
            <template v-else>
              <template v-if="message.type === 'user'">
                {{ message.message }}
              </template>
              <template v-else>
                {{ message.response }}
              </template>
            </template>
          </div>
          <div v-if="message.type === 'user'" class="avatar">
            <AvatarLetter :username="userStore.user?.username || '?'" :size="40" />
          </div>
        </div>
      </div>
    </div>
    
    <div class="input-area">
      <!-- 问诊类型选择 -->
      <van-popover
              v-model:show="showTypeSelect"
              placement="top-start"
              theme="light"
              trigger="click"
            >
              <div class="type-select">
                <div class="type-options">
                  <div 
                    v-for="type in medicineTypes" 
                    :key="type.value"
                    class="type-option"
                    :class="{ active: medicineType === type.value }"
                    @click="selectType(type.value)"
                  >
                    <van-icon 
                      :name="type.value === 'western' ? 'cluster-o' : 'flower-o'" 
                      class="type-icon"
                    />
                    {{ type.text }}
                  </div>
                </div>
              </div>
              <template #reference>
                <van-icon 
                  :name="medicineType === 'western' ? 'cluster-o' : 'flower-o'" 
                  size="20" 
                  class="toolbar-icon"
                />
              </template>
            </van-popover>
      <van-form @submit="sendMessage" class="input-form">
        <div class="message-input-wrapper">
          <div class="toolbar-left">
            <van-uploader
              v-model="uploadedFiles"
              :max-count="1"
              :before-read="beforeUpload"
              :after-read="afterUpload"
            >
              <van-icon name="add-o" size="20" class="toolbar-icon" />
            </van-uploader>
          </div>

          <!-- 输入框 -->
          <van-field
            v-model="inputMessage"
            placeholder="请描述您的症状或者健康问题..."
            :autosize="{ minHeight: 24, maxHeight: 72 }"
            type="textarea"
            class="message-field"
          />

          <!-- 发送按钮 -->
          <van-button
            type="primary"
            size="small"
            :loading="sending"
            native-type="submit"
            class="send-btn"
            round
          >
            发送
          </van-button>
        </div>
      </van-form>
    </div>
    
    <van-popup
      v-model:show="showHistoryPopup"
      position="right"
      :style="{ width: '80%', height: '100%' }"
      z-index="1000"
    >
      <div class="history-container">
        <van-nav-bar
          title="聊天历史"
          left-arrow
          @click-left="showHistoryPopup = false"
        >
          <template #right>
            <van-icon 
              name="plus" 
              size="20" 
              @click="createNewChat"
            />
          </template>
        </van-nav-bar>
        
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="historyLoading"
            :finished="historyFinished"
            finished-text="没有更多了"
            @load="loadHistory"
          >
            <van-cell
              v-for="(group, index) in chatHistory"
              :key="index"
              :title="formatDate(group.created_at)"
              :label="group.last_message"
              is-link
              @click="loadChatDetail(group)"
            >
              <template #value>
                <span class="message-count">{{ group.message_count }}条消息</span>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { showToast, showDialog } from 'vant'
import { formatDate } from '@/utils/date'
import { useRouter } from 'vue-router'
import AvatarLetter from '@/components/AvatarLetter.vue'

const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()

const chatContainer = ref(null)
const inputMessage = ref('')
const sending = ref(false)
const showHistoryPopup = ref(false)
const historyLoading = ref(false)
const historyFinished = ref(false)
const refreshing = ref(false)
const chatHistory = ref([])
const uploadedFiles = ref([])

// 医疗类型选择
const medicineType = ref('western')
const medicineTypes = [
  { text: '西医咨询', value: 'western' },
  { text: '中医咨询', value: 'traditional' }
]

// 问诊类型选择
const showTypeSelect = ref(false)
const selectType = (type) => {
  medicineType.value = type
  showTypeSelect.value = false
}

// 监听聊天记录变化，自动滚动到底部
watch(() => chatStore.chatHistory.length, () => {
  scrollToBottom()
})

onMounted(() => {
  initChat()
})

const initChat = async () => {
  if (userStore.user?.userId) {
    // 获取聊天组列表
    await chatStore.getChatGroups(userStore.user.userId)
    // 如果没有当前聊天组，创建新的
    if (!chatStore.currentGroupId) {
      await chatStore.createChatGroup()
    }
    scrollToBottom()
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const onClickLeft = () => {
  router.push('/YueJ/home')
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  if (!userStore.user?.userId) {
    showToast('请先登录')
    router.push('/YueJ/login')
    return
  }
  
  const messageText = inputMessage.value.trim()
  inputMessage.value = '' // 立即清空输入框
  
  sending.value = true
  try {
    console.log('Starting to send message:', messageText)
    const response = await chatStore.sendMessage({
      userId: userStore.user.userId,
      message: messageText,
      type: 'user',
      conversationType: medicineType.value
    })
    
    console.log('Message sent successfully:', response)
    
    // 如果没有立即获取到AI回复，等待一会儿后刷新
    if (!response?.response) {
      console.log('No immediate response, waiting to refresh...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      await refreshChat()
    }
    
    // 滚动到底部
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Failed to send message:', error)
    showToast(error.message || '发送失败，请重试')
    // 恢复消息到输入框
    inputMessage.value = messageText
  } finally {
    sending.value = false
  }
}

// 添加刷新聊天记录的方法
const refreshChat = async () => {
  try {
    if (chatStore.currentGroupId) {
      console.log('Refreshing chat history...')
      await chatStore.loadGroupChat(userStore.user.userId, chatStore.currentGroupId)
      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('Failed to refresh chat:', error)
  }
}

const beforeUpload = (file) => {
  // 验证文件类型和大小
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    showToast('请上传图片文件')
    return false
  }
  
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    showToast('图片大小不能超过2MB')
    return false
  }
  
  return true
}

const afterUpload = async (file) => {
  if (!userStore.user?.userId) {
    showToast('请先登录')
    router.push('/YueJ/login')
    return
  }

  const formData = new FormData()
  formData.append('image', file.file)
  formData.append('conversationType', medicineType.value)
  
  try {
    await chatStore.sendImage(formData)
    uploadedFiles.value = []
  } catch (error) {
    showToast('图片分析失败')
  }
}

const showHistory = () => {
  showHistoryPopup.value = true
  loadHistory()
}

const loadHistory = async () => {
  if (historyLoading.value) return
  if (!userStore.user?.userId) return
  
  try {
    const groups = await chatStore.getChatGroups(userStore.user.userId)
    chatHistory.value = groups
    historyFinished.value = true
  } catch (error) {
    showToast('加载历史记录失败')
  } finally {
    historyLoading.value = false
  }
}

const loadChatDetail = async (chat) => {
  try {
    showHistoryPopup.value = false
    console.log('选择的聊天组:', chat)
    
    if (!chat.chat_group_id) {
      showToast('无效的聊天记录')
      return
    }
    
    await chatStore.loadGroupChat(userStore.user.userId, chat.chat_group_id)
    router.push('/YueJ/chat')
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('加载聊天记录失败:', error)
    showToast('加载聊天记录失败')
  }
}

const onRefresh = async () => {
  refreshing.value = true
  try {
    await loadHistory()
  } finally {
    refreshing.value = false
  }
}

// 新建聊天方法
const createNewChat = async () => {
  try {
    if (!userStore.user?.userId) {
      showToast('请先登录')
      router.push('/YueJ/login')
      return
    }
    
    // 创建新的聊天组
    await chatStore.createChatGroup()
    // 清空聊天历史
    chatStore.chatHistory = []
    // 关闭历史记录弹窗
    showHistoryPopup.value = false
    // 清空输入框
    inputMessage.value = ''
    // 重置医疗类型
    medicineType.value = 'western'
    
    showToast('新建聊天成功')
  } catch (error) {
    console.error('新建聊天失败:', error)
    showToast('新建聊天失败')
  }
}

defineOptions({
  name: 'Chat'
})
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chat-nav {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 160px;
}

.message-list {
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message-left {
  justify-content: flex-start;
}

.message-right {
  justify-content: flex-end;
}

.avatar {
  margin-right: 8px;
}

.message-content {
  max-width: 70%;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.message-content.user {
  background: var(--primary-color);
  color: #fff;
  margin-left: auto;
}

.message-content.ai {
  background: #fff;
  color: var(--text-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.typing {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color-light);
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 16px;
  background: #fff;
  border-top: 1px solid var(--border-color);
  z-index: 99;
}

.input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  background: #fff;
}

.message-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
}

.input-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-icon {
  color: #666;
  cursor: pointer;
  padding: 4px;
}

.toolbar-icon:active {
  opacity: 0.7;
}

.type-select {
  padding: 8px;
  min-width: 200px;
}

.type-options {
  display: flex;
  gap: 8px;
}

.type-option {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.type-option:hover {
  background: #f5f5f5;
}

.type-option.active {
  color: var(--primary-color);
  background: var(--primary-color-light);
  font-weight: 500;
}

.type-icon {
  font-size: 16px;
}

.send-btn {
  height: 32px;
  padding: 0 16px;
}

:deep(.van-field) {
  padding: 8px 0;
  background: transparent;
}

:deep(.van-field__control) {
  min-height: 20px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 18px;
}

:deep(.van-cell::after) {
  display: none;
}

.history-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.upload-container {
  padding: 16px;
}

.upload-actions {
  margin-top: 16px;
}

:deep(.van-field__button) {
  margin-left: 0;
}

:deep(.markdown) {
  line-height: 1.6;
}

:deep(.markdown p) {
  margin: 8px 0;
}

:deep(.markdown ul, .markdown ol) {
  padding-left: 20px;
}

:deep(.markdown code) {
  background: #f5f5f5;
  padding: 2px 4px;
  border-radius: 4px;
}

.medicine-type {
  flex-shrink: 0;
  margin-right: 8px;
  height: 36px;
}

:deep(.van-dropdown-menu__bar) {
  height: 36px;
}

:deep(.van-dropdown-menu__title) {
  font-size: 14px;
  line-height: 36px;
}

.message-count {
  font-size: 12px;
  color: var(--text-color-light);
}

.ai-response {
  white-space: pre-wrap;
  word-break: break-word;
}

@supports (-webkit-touch-callout: none) {
  .chat-page {
    height: -webkit-fill-available;
  }
  
  .input-area {
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
  }
}

.message-input-wrapper {
  display: flex;
  align-items: end;
  width: 100%;
  background: #f5f5f5;
  border-radius: 14px;
  min-height: 26px;
  padding: 3px 6px;
}

.toolbar-left {
  display: flex;
  gap: 10px;
  padding: 0 6px;
}

.toolbar-icon {
  color: #666;
  cursor: pointer;
  padding: 3px;
  font-size: 18px;
  margin-bottom: 5px;
}

.message-field {
  flex: 1;
}

.send-btn {
  height: 28px;
  margin-left: 6px;
  margin-bottom: 5px;
}

:deep(.van-field__control) {
  min-height: 28px;
  padding: 6px 10px;
  background: transparent;
}

/* 添加新建聊天按钮样式 */
:deep(.van-nav-bar__right) {
  cursor: pointer;
  padding: 0 16px;
}

:deep(.van-nav-bar__right:active) {
  opacity: 0.7;
}
</style> 