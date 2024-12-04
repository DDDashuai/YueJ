<template>
  <div class="layout">
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/YueJ/" icon="home-o">
        <template #icon="props">
          <van-icon :name="props.active ? 'home' : 'home-o'" :color="props.active ? '#1989fa' : ''" />
        </template>
        <span :class="{ 'text-primary': active === 0 }">首页</span>
      </van-tabbar-item>
      
      <van-tabbar-item to="/YueJ/health" icon="chart-trending-o">
        <template #icon="props">
          <van-icon :name="props.active ? 'chart-trending' : 'chart-trending-o'" :color="props.active ? '#1989fa' : ''" />
        </template>
        <span :class="{ 'text-primary': active === 1 }">健康数据</span>
      </van-tabbar-item>
      
      <van-tabbar-item to="/YueJ/chat" icon="chat-o">
        <template #icon="props">
          <van-icon :name="props.active ? 'chat' : 'chat-o'" :color="props.active ? '#1989fa' : ''" />
        </template>
        <span :class="{ 'text-primary': active === 2 }">智能问诊</span>
      </van-tabbar-item>
      
      <van-tabbar-item to="/YueJ/medicine" icon="clock-o">
        <template #icon="props">
          <van-icon :name="props.active ? 'clock' : 'clock-o'" :color="props.active ? '#1989fa' : ''" />
        </template>
        <span :class="{ 'text-primary': active === 3 }">用药助手</span>
      </van-tabbar-item>
      
      <van-tabbar-item to="/YueJ/profile" icon="user-o">
        <template #icon="props">
          <van-icon :name="props.active ? 'user' : 'user-o'" :color="props.active ? '#1989fa' : ''" />
        </template>
        <span :class="{ 'text-primary': active === 4 }">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(0)

// 根据路由路径设置当前激活的标签
const routeMap = {
  '/YueJ/': 0,
  '/YueJ/health': 1,
  '/YueJ/chat': 2,
  '/YueJ/medicine': 3,
  '/YueJ/profile': 4
}

watch(() => route.path, (path) => {
  active.value = routeMap[path] || 0
}, { immediate: true })
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding-bottom: 50px;
}

:deep(.van-tabbar-item) {
  color: var(--text-color-light);
}

:deep(.van-tabbar-item--active) {
  color: var(--primary-color);
}

.text-primary {
  color: var(--primary-color);
}
</style> 