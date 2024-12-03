<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  const isAuth = await userStore.checkAuth()
  if (!isAuth && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  } else if (isAuth && router.currentRoute.value.path === '/') {
    router.push('/home')
  }
})
</script>

<style>
:root {
  --primary-color: #1989fa;
  --success-color: #07c160;
  --warning-color: #ff976a;
  --danger-color: #ee0a24;
  --text-color: #323233;
  --text-color-light: #969799;
  --background-color: #f7f8fa;
  --border-color: #ebedf0;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  color: var(--text-color);
}
</style>
