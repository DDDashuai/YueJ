<template>
  <div class="layout">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['Home', 'Chat', 'Health', 'Medicine', 'Profile']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <TabBar v-if="showTabBar && !isChat" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'

const route = useRoute()

// 不需要显示TabBar的路由
const hideTabBarRoutes = [
  '/YueJ/login', 
  '/YueJ/register', 
  '/YueJ/forgot-password'
]

const showTabBar = computed(() => {
  return !hideTabBarRoutes.includes(route.path)
})

// 判断是否是聊天页面
const isChat = computed(() => {
  return route.path === '/YueJ/chat'
})
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style> 