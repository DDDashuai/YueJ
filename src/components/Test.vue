<template>
  <div class="test">
    <h1>测试组件</h1>
    <van-button type="primary" @click="test">测试按钮</van-button>
  </div>
</template>

<script setup>
import { showToast } from 'vant'

const test = () => {
  showToast('测试成功')
}
</script> 