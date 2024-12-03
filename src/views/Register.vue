<template>
  <div class="register-page">
    <van-nav-bar 
      title="注册账号" 
      left-arrow 
      @click-left="onClickLeft"
    />
    
    <div class="register-form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[
              { required: true, message: '请填写密码' },
              { min: 6, message: '密码至少6位' }
            ]"
          />
          
          <van-field
            v-model="form.confirmPassword"
            type="password"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[
              { required: true, message: '请确认密码' },
              { validator: validateConfirmPassword, message: '两次密码不一致' }
            ]"
          />
          
          <van-field
            v-model="form.phone"
            type="tel"
            name="phone"
            label="手机号"
            placeholder="请输入手机号（选填）"
            :rules="[
                { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' }
            ]"
          />
        </van-cell-group>
        
        <div class="form-actions">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="submitting"
          >
            注册
          </van-button>
          
          <div class="agreement">
            <van-checkbox v-model="agreed" shape="square">
              我已阅读并同意
              <span class="link" @click.stop="showAgreement">《用户协议》</span>
              和
              <span class="link" @click.stop="showPrivacy">《隐私政策》</span>
            </van-checkbox>
          </div>
        </div>
      </van-form>
    </div>
    
    <!-- 协议弹窗 -->
    <van-popup
      v-model:show="showAgreementPopup"
      position="bottom"
      round
      :style="{ height: '70%' }"
    >
      <div class="agreement-content">
        <van-nav-bar
          title="用户协议"
          left-arrow
          @click-left="showAgreementPopup = false"
        />
        <div class="agreement-text">
          <!-- 协议内容 -->
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { showToast, showDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  verifyCode: ''
})

const agreed = ref(false)
const submitting = ref(false)
const countdown = ref(0)
const showAgreementPopup = ref(false)

const validateConfirmPassword = (value) => {
  return value === form.password
}

const onClickLeft = () => {
  router.back()
}

const onSubmit = async () => {
  if (!agreed.value) {
    showToast('请先同意用户协议和隐私政策')
    return
  }
  
  submitting.value = true
  try {
    const success = await userStore.register(form)
    if (success) {
      showDialog({
        title: '注册成功',
        message: '是否立即登录？',
        showCancelButton: true,
      }).then(() => {
        router.push('/login')
      })
    }
  } catch (error) {
    showToast('注册失败')
  } finally {
    submitting.value = false
  }
}

const showAgreement = () => {
  showAgreementPopup.value = true
}

const showPrivacy = () => {
  // TODO: 显示隐私政策
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: var(--background-color);
}

.register-form {
  padding: 20px;
}

.form-actions {
  margin-top: 24px;
}

.agreement {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
}

.link {
  color: var(--primary-color);
}

.agreement-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.agreement-text {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

:deep(.van-field__label) {
  width: 90px;
}
</style> 