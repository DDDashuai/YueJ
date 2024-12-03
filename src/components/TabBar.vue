<template>
  <van-tabbar v-model="active" route @change="onChange">
    <van-tabbar-item 
      name="home"
      to="/home" 
      icon="home-o"
    >
      首页
    </van-tabbar-item>
    <van-tabbar-item 
      name="health"
      to="/health" 
      icon="records"
    >
      健康
    </van-tabbar-item>
    <van-tabbar-item 
      name="chat"
      icon="chat-o"
      @click="handleChatClick"
    >
      问诊
    </van-tabbar-item>
    <van-tabbar-item 
      name="medicine"
      to="/medicine" 
      icon="clock-o"
    >
      用药
    </van-tabbar-item>
    <van-tabbar-item 
      name="profile"
      to="/profile" 
      icon="user-o"
    >
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const active = ref(0)

// 路由映射到tabbar索引
const routeMap = {
  '/home': 0,
  '/health': 1,
  '/chat': 2,
  '/medicine': 3,
  '/profile': 4
}

// 监听路由变化，更新active
watch(() => route.path, (path) => {
  active.value = routeMap[path] ?? 0
}, { immediate: true })

const handleChatClick = () => {
  router.push('/chat')
}

const onChange = (index) => {
  console.log('TabBar changed:', index)
}
</script>

<style scoped>
:deep(.van-tabbar-item) {
  color: var(--text-color-light);
}

:deep(.van-tabbar-item--active) {
  color: var(--primary-color);
}

:deep(.van-tabbar-item__icon) {
  font-size: 20px;
}

:deep(.van-tabbar-item__text) {
  font-size: 12px;
}
</style> 