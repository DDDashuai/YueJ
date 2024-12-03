<template>
  <div 
    class="avatar-letter" 
    :style="{ 
      width: size + 'px', 
      height: size + 'px',
      fontSize: size * 0.4 + 'px',
      backgroundColor: bgColor
    }"
  >
    {{ letter }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  username: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 40
  }
})

// 获取用户名首字母
const letter = computed(() => {
  if (!props.username) return '?'
  return props.username.charAt(0).toUpperCase()
})

// 根据用户名生成固定的背景色
const bgColor = computed(() => {
  const colors = [
    '#9E9E9E', // 灰色系列
    '#757575',
    '#616161',
    '#424242',
    '#BDBDBD'
  ]
  const index = props.username.length % colors.length
  return colors[index]
})
</script>

<style scoped>
.avatar-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 500;
  user-select: none;
}
</style>