<template>
  <div class="profile-page">
    <!-- 用户基本信息卡片 -->
    <div class="user-card">
      <div class="avatar-wrapper" @click="showAvatarPicker">
        <AvatarLetter
          :username="userStore.user?.username || '?'"
          :size="80"
        />
        <div class="avatar-edit">
          <van-icon name="photograph" />
        </div>
      </div>
      <h2 class="username">{{ userStore.user?.username }}</h2>
    </div>

    <!-- 功能列表 -->
    <div class="menu-list">
      <!-- 个人资料 -->
      <div class="menu-group">
        <div class="group-title">个人资料</div>
        <van-cell-group inset>
          <van-cell 
            title="基本信息" 
            is-link 
            @click="showBasicInfo"
          />
          <van-cell 
            title="健康档案" 
            is-link 
            @click="showHealthRecord"
          >
            <template #right-icon>
              <van-badge :content="healthStore.unreadCount || ''" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 用药管理 -->
      <div class="menu-group">
        <div class="group-title">用药管理</div>
        <van-cell-group inset>
          <van-cell 
            title="用药提醒" 
            is-link 
            @click="toMedicineReminder"
          >
            <template #right-icon>
              <van-badge :content="medicineStore.activeReminders.length || ''" />
            </template>
          </van-cell>
          <van-cell 
            title="用药记录" 
            is-link 
            @click="showMedicineHistory"
          />
        </van-cell-group>
      </div>

      <!-- 消息通知 -->
      <div class="menu-group">
        <div class="group-title">消息通知</div>
        <van-cell-group inset>
          <van-cell 
            title="系统通知" 
            is-link 
            @click="showNotifications"
          >
            <template #right-icon>
              <van-badge :content="unreadNotifications" />
            </template>
          </van-cell>
          <van-cell 
            title="问诊记录" 
            is-link 
            @click="showChatHistory"
          />
        </van-cell-group>
      </div>

      <!-- 系统设置 -->
      <div class="menu-group">
        <div class="group-title">系统设置</div>
        <van-cell-group inset>
          <van-cell 
            title="通知设置" 
            is-link 
            @click="showNotificationSettings"
          />
          <van-cell 
            title="隐私设置" 
            is-link 
            @click="showPrivacySettings"
          />
          <van-cell 
            title="关于我们" 
            is-link 
            @click="showAbout"
          />
        </van-cell-group>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <div class="logout-btn">
      <van-button 
        block 
        type="danger" 
        @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>

    <!-- 头像选择弹窗 -->
    <van-action-sheet
      v-model:show="showAvatarSheet"
      :actions="avatarActions"
      cancel-text="取消"
      @select="onSelectAvatar"
    />

    <!-- 基本信息编辑弹窗 -->
    <van-popup
      v-model:show="showBasicInfoPopup"
      position="bottom"
      round
      :style="{ height: '70%' }"
    >
      <div class="popup-content">
        <van-nav-bar
          title="基本信息"
          left-arrow
          @click-left="showBasicInfoPopup = false"
        >
          <template #right>
            <van-button 
              type="primary" 
              size="small" 
              @click="saveBasicInfo"
            >
              保存
            </van-button>
          </template>
        </van-nav-bar>

        <van-form @submit="saveBasicInfo">
          <van-cell-group inset>
            <van-field
              v-model="userInfo.username"
              label="用户名"
              placeholder="请输入用户名"
              :rules="[{ required: true, message: '请输入用户名' }]"
            />
            <van-field
              v-model="userInfo.email"
              label="邮箱"
              placeholder="请输入邮箱"
              :rules="[
                { required: true, message: '请输入邮箱' },
                { pattern: /.+@.+/, message: '请输入正确的邮箱格式' }
              ]"
            />
            <van-field
              v-model="userInfo.phone"
              label="手机号"
              placeholder="请输入手机号"
              :rules="[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]"
            />
            <van-field
              v-model="userInfo.age"
              label="年龄"
              type="number"
              placeholder="请输入年龄"
            />
            <van-field
              v-model="userInfo.gender"
              label="性别"
              readonly
              is-link
              @click="showGenderPicker = true"
            />
          </van-cell-group>
        </van-form>
      </div>
    </van-popup>

    <!-- 性别选择器 -->
    <van-popup
      v-model:show="showGenderPicker"
      position="bottom"
      round
    >
      <van-picker
        :columns="genderOptions"
        @confirm="onConfirmGender"
        @cancel="showGenderPicker = false"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useHealthStore } from '@/stores/health'
import { useMedicineStore } from '@/stores/medicine'
import { showToast, showDialog } from 'vant'
import AvatarLetter from '@/components/AvatarLetter.vue'

const router = useRouter()
const userStore = useUserStore()
const healthStore = useHealthStore()
const medicineStore = useMedicineStore()

// 状态变量
const showAvatarSheet = ref(false)
const showBasicInfoPopup = ref(false)
const showGenderPicker = ref(false)
const unreadNotifications = ref(0)

// 用户信息表单
const userInfo = ref({
  username: '',
  email: '',
  phone: '',
  age: '',
  gender: ''
})

// 性别选项
const genderOptions = ['男', '女', '其他']

// 头像操作选项
const avatarActions = [
  { name: '拍照', value: 'camera' },
  { name: '从相册选择', value: 'album' }
]

// 初始化数据
onMounted(async () => {
  if (userStore.user?.userId) {
    await Promise.all([
      loadUserInfo(),
      loadNotifications()
    ])
  }
})

// 加载用户信息
const loadUserInfo = async () => {
  const info = await userStore.getUserInfo()
  if (info) {
    userInfo.value = { ...info }
  }
}

// 加载通知数量
const loadNotifications = async () => {
  // TODO: 实现通知数量加载
  unreadNotifications.value = 0
}

// 头像相关方法
const showAvatarPicker = () => {
  showAvatarSheet.value = true
}

const onSelectAvatar = async (action) => {
  // 实现头像上传逻辑
  if (action.value === 'camera') {
    // 调用相机
  } else {
    // 打开相册
  }
  showAvatarSheet.value = false
}

// 基本信息相关方法
const showBasicInfo = () => {
  showBasicInfoPopup.value = true
}

const saveBasicInfo = async () => {
  try {
    await userStore.updateUserInfo(userInfo.value)
    showToast('保存成功')
    showBasicInfoPopup.value = false
  } catch (error) {
    showToast('保存失败')
  }
}

const onConfirmGender = (value) => {
  userInfo.value.gender = value
  showGenderPicker.value = false
}

// 导航方法
const showHealthRecord = () => {
  router.push('/health')
}

const toMedicineReminder = () => {
  router.push('/medicine')
}

const showMedicineHistory = () => {
  router.push('/medicine/history')
}

const showNotifications = () => {
  router.push('/notifications')
}

const showChatHistory = () => {
  router.push('/chat')
}

const showNotificationSettings = () => {
  router.push('/settings/notifications')
}

const showPrivacySettings = () => {
  router.push('/settings/privacy')
}

const showAbout = () => {
  router.push('/about')
}

// 退出登录
const handleLogout = () => {
  showDialog({
    title: '提示',
    message: '确认退出登录？',
    showCancelButton: true
  }).then(async (action) => {
    if (action === 'confirm') {
      await userStore.logout()
      router.replace('/login')
    }
  })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--background-color);
  padding-bottom: 32px;
}

.user-card {
  background: #fff;
  padding: 32px 16px;
  text-align: center;
  margin-bottom: 16px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.avatar-edit {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}

.username {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.menu-group {
  margin-bottom: 16px;
}

.group-title {
  padding: 0 16px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-color-light);
}

.logout-btn {
  margin: 32px 16px;
}

.popup-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.van-form) {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}
</style> 