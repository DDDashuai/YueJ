<template>
  <van-tabbar v-model="active" route @change="onChange">
    <van-tabbar-item 
      name="home"
      to="/YueJ/home" 
      icon="home-o"
    >
      首页
    </van-tabbar-item>
    <van-tabbar-item 
      name="health"
      to="/YueJ/health" 
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
      to="/YueJ/medicine" 
      icon="clock-o"
    >
      用药
    </van-tabbar-item>
    <van-tabbar-item 
      name="profile"
      to="/YueJ/profile" 
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
  '/YueJ/home': 0,
  '/YueJ/health': 1,
  '/YueJ/chat': 2,
  '/YueJ/medicine': 3,
  '/YueJ/profile': 4
}

// 监听路由变化，更新active
watch(() => route.path, (path) => {
  active.value = routeMap[path] ?? 0
}, { immediate: true })

const handleChatClick = () => {
  router.push('/YueJ/chat')
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