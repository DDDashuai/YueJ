<template>
  <div class="login-page">
    <div class="login-header">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <h2 class="title">老年人健康管理平台</h2>
    </div>
    
    <div class="login-form">
      <van-form @submit="onSubmit" class="form-content">
        <van-cell-group inset>
          <van-field
            v-model="form.username"
            name="username"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          >
            <template #label>
              <van-icon name="user-o" class="field-icon" />
              <span class="field-label">用户名</span>
            </template>
          </van-field>
          
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          >
            <template #label>
              <van-icon name="lock" class="field-icon" />
              <span class="field-label">密码</span>
            </template>
          </van-field>
        </van-cell-group>
        
        <div class="form-actions">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            登录
          </van-button>
          
          <div class="action-links">
            <span class="link" @click="toRegister">注册账号</span>
            <span class="divider">|</span>
            <span class="link" @click="toForgotPassword">忘记密码</span>
          </div>
        </div>
      </van-form>
    </div>
    
    <div class="login-footer">
      <p class="copyright">© 2024 健康管理平台 版权所有</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const onSubmit = async () => {
  loading.value = true
  showLoadingToast({
    message: '登录中...',
    forbidClick: true,
  })
  
  try {
    const success = await userStore.login(form.username, form.password)
    if (success) {
      showToast({
        type: 'success',
        message: '登录成功',
      })
      await router.push('/')
    } else {
      showToast({
        type: 'fail',
        message: '用户名或密码错误',
      })
    }
  } catch (error) {
    showToast({
      type: 'fail',
      message: error.message || '登录失败，请稍后重试',
    })
  } finally {
    loading.value = false
    closeToast()
  }
}

const toRegister = () => {
  router.push('/register')
}

const toForgotPassword = () => {
  router.push('/forgot-password')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--primary-color) 0%, #36cccb 100%);
}

.login-header {
  padding: 60px 0 40px;
  text-align: center;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.title {
  color: #fff;
  font-size: 24px;
  font-weight: 500;
}

.login-form {
  flex: 1;
  padding: 0 20px;
}

.form-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.field-icon {
  margin-right: 4px;
  color: var(--text-color-light);
}

.field-label {
  color: var(--text-color);
}

.form-actions {
  margin-top: 24px;
}

.action-links {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
}

.link {
  color: var(--primary-color);
  cursor: pointer;
}

.divider {
  margin: 0 8px;
  color: var(--text-color-light);
}

.login-footer {
  padding: 16px;
  text-align: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

:deep(.van-cell) {
  padding: 16px;
}

:deep(.van-field__label) {
  width: 80px;
}
</style> 