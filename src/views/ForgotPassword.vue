<template>
  <div class="forgot-password-page">
    <van-nav-bar 
      title="找回密码" 
      left-arrow 
      @click-left="onClickLeft"
    />
    
    <div class="step-indicator">
      <van-steps :active="currentStep">
        <van-step>验证身份</van-step>
        <van-step>重置密码</van-step>
        <van-step>完成</van-step>
      </van-steps>
    </div>
    
    <!-- 步骤1：验证身份 -->
    <div v-show="currentStep === 0" class="form-container">
      <van-form @submit="verifyIdentity">
        <van-cell-group inset>
          <van-field
            v-model="form.phone"
            type="tel"
            label="手机号"
            placeholder="请输入注册手机号"
            :rules="[
              { required: true, message: '请填写手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' }
            ]"
          />
          
          <van-field
            v-model="form.verifyCode"
            center
            clearable
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请填写验证码' }]"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="!!countdown"
                @click="sendVerifyCode"
              >
                {{ countdown ? `${countdown}s后重试` : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>
        
        <div class="form-actions">
          <van-button round block type="primary" native-type="submit">
            下一步
          </van-button>
        </div>
      </van-form>
    </div>
    
    <!-- 步骤2：重置密码 -->
    <div v-show="currentStep === 1" class="form-container">
      <van-form @submit="resetPassword">
        <van-cell-group inset>
          <van-field
            v-model="form.newPassword"
            type="password"
            label="新密码"
            placeholder="请输入新密码"
            :rules="[
              { required: true, message: '请填写新密码' },
              { min: 6, message: '密码至少6位' }
            ]"
          />
          
          <van-field
            v-model="form.confirmPassword"
            type="password"
            label="确认密码"
            placeholder="请再次输入新密码"
            :rules="[
              { required: true, message: '请确认密码' },
              { validator: validateConfirmPassword, message: '两次密码不一致' }
            ]"
          />
        </van-cell-group>
        
        <div class="form-actions">
          <van-button round block type="primary" native-type="submit">
            确认修改
          </van-button>
        </div>
      </van-form>
    </div>
    
    <!-- 步骤3：完成 -->
    <div v-show="currentStep === 2" class="success-container">
      <van-empty
        image="success"
        description="密码重置成功"
      >
        <template #bottom>
          <van-button
            round
            type="primary"
            class="bottom-button"
            @click="toLogin"
          >
            立即登录
          </van-button>
        </template>
      </van-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const currentStep = ref(0)
const countdown = ref(0)

const form = reactive({
  phone: '',
  verifyCode: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (value) => {
  return value === form.newPassword
}

const onClickLeft = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  } else {
    router.back()
  }
}

const sendVerifyCode = async () => {
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  
  try {
    // TODO: 调用发送验证码API
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    showToast('验证码发送失败')
  }
}

const verifyIdentity = async () => {
  try {
    // TODO: 验证身份
    currentStep.value = 1
  } catch (error) {
    showToast('验证失败')
  }
}

const resetPassword = async () => {
  try {
    // TODO: 重置密码
    currentStep.value = 2
  } catch (error) {
    showToast('密码重置失败')
  }
}

const toLogin = () => {
  router.replace('/login')
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  background: var(--background-color);
}

.step-indicator {
  margin: 20px 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.form-container {
  padding: 20px;
}

.form-actions {
  margin-top: 24px;
}

.success-container {
  padding: 40px 20px;
}

.bottom-button {
  width: 160px;
  margin-top: 20px;
}

:deep(.van-field__label) {
  width: 90px;
}
</style> 