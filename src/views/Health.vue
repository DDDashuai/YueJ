<template>
  <div class="health-page">
    <van-nav-bar title="健康数据" />
    
    <div class="data-overview card">
      <van-row>
        <van-col span="12" v-for="item in healthData" :key="item.type">
          <div class="data-item">
            <div class="data-value" :class="item.status">
              {{ item.value || '--' }}
              <span class="unit">{{ item.unit }}</span>
            </div>
            <div class="data-label">{{ item.label }}</div>
            <div class="data-trend" v-if="item.trend">
              <van-icon 
                :name="item.trend > 0 ? 'arrow-up' : 'arrow-down'"
                :color="item.trend > 0 ? '#ee0a24' : '#07c160'"
              />
              {{ Math.abs(item.trend) }}%
            </div>
          </div>
        </van-col>
      </van-row>
    </div>
    
    <div class="data-input card">
      <div class="card-header">
        <h3>数据录入</h3>
        <van-button size="small" type="primary" @click="showDatePicker">
          {{ formatDate(selectedDate) }}
        </van-button>
      </div>
      
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.bloodPressure"
            label="血压"
            placeholder="请输入血压值"
            right-icon="question-o"
            @click-right-icon="showTip('bloodPressure')"
          >
            <template #right-icon>
              <span class="unit-text">mmHg</span>
            </template>
          </van-field>
          
          <van-field
            v-model="form.heartRate"
            type="digit"
            label="心率"
            placeholder="请输入心率值"
          >
            <template #right-icon>
              <span class="unit-text">次/分</span>
            </template>
          </van-field>
          
          <van-field
            v-model="form.bloodSugar"
            type="digit"
            label="血糖"
            placeholder="请输入血糖值"
          >
            <template #right-icon>
              <span class="unit-text">mmol/L</span>
            </template>
          </van-field>
          
          <van-field
            v-model="form.weight"
            type="digit"
            label="体重"
            placeholder="请输入体重"
          >
            <template #right-icon>
              <span class="unit-text">kg</span>
            </template>
          </van-field>
        </van-cell-group>
        
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            保存记录
          </van-button>
        </div>
      </van-form>
    </div>
    
    <div class="data-history card">
      <div class="card-header">
        <h3>历史记录</h3>
        <van-button size="small" plain type="primary" @click="showFilter">
          筛选
        </van-button>
      </div>
      
      <van-empty v-if="historyList.length === 0" description="暂无记录" />
      
      <div v-else class="history-list">
        <div v-for="item in historyList" :key="item.healthRecordId" class="history-item">
          <div class="history-date">{{ formatDate(item.updateTime) }}</div>
          <div class="history-content">
            <div class="history-data">
              <span class="label">血压</span>
              <span class="value">{{ item.bloodPressure }}mmHg</span>
            </div>
            <!-- 其他健康数据 -->
          </div>
          <van-button 
            size="small" 
            type="danger" 
            plain
            @click="deleteRecord(item.healthRecordId)"
          >
            删除
          </van-button>
        </div>
      </div>
    </div>
    
    <!-- 日期选择弹窗 -->
    <van-popup v-model:show="showDatePickerPopup" position="bottom">
      <van-datetime-picker
        v-model="selectedDate"
        type="date"
        title="选择日期"
        :max-date="new Date()"
        @confirm="onDateConfirm"
        @cancel="showDatePickerPopup = false"
      />
    </van-popup>
    
    <!-- 筛选弹窗 -->
    <van-popup 
      v-model:show="showFilterPopup"
      position="right"
      :style="{ width: '80%', height: '100%' }"
    >
      <div class="filter-container">
        <van-nav-bar
          title="筛选条件"
          left-arrow
          @click-left="showFilterPopup = false"
        />
        
        <div class="filter-content">
          <van-cell-group>
            <van-cell title="时间范围">
              <template #right-icon>
                <van-button size="small" @click="showDateRangePicker">
                  选择时间
                </van-button>
              </template>
            </van-cell>
            
            <van-cell title="数据类型">
              <template #right-icon>
                <van-checkbox-group v-model="filterTypes">
                  <van-checkbox 
                    v-for="type in dataTypes" 
                    :key="type.value"
                    :name="type.value"
                  >
                    {{ type.label }}
                  </van-checkbox>
                </van-checkbox-group>
              </template>
            </van-cell>
          </van-cell-group>
          
          <div class="filter-actions">
            <van-button block type="primary" @click="applyFilter">
              应用筛选
            </van-button>
            <van-button block plain @click="resetFilter">
              重置
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useHealthStore } from '../stores/health'
import { showToast, showDialog } from 'vant'
import { formatDate } from '../utils/date'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const healthStore = useHealthStore()
const userStore = useUserStore()
const router = useRouter()

// 健康数据概览
const healthData = ref([
  { type: 'bloodPressure', label: '血压', value: null, unit: 'mmHg', status: '' },
  { type: 'heartRate', label: '心率', value: null, unit: '次/分', status: '' },
  { type: 'bloodSugar', label: '血糖', value: null, unit: 'mmol/L', status: '' },
  { type: 'weight', label: '体重', value: null, unit: 'kg', status: '' }
])

// 表单数据
const selectedDate = ref(new Date())
const form = reactive({
  bloodPressure: '',
  heartRate: '',
  bloodSugar: '',
  weight: ''
})

// 历史记录
const historyList = ref([])

// 弹窗控制
const showDatePickerPopup = ref(false)
const showFilterPopup = ref(false)

// 筛选条件
const filterTypes = ref([])
const dataTypes = [
  { label: '血压', value: 'bloodPressure' },
  { label: '心率', value: 'heartRate' },
  { label: '血糖', value: 'bloodSugar' },
  { label: '体重', value: 'weight' }
]

onMounted(async () => {
  if (userStore.user?.userId) {
    await loadData()
  }
})

const loadData = async () => {
  if (!userStore.user?.userId) {
    showToast('请先登录')
    router.push('/login')
    return
  }

  try {
    await Promise.all([
      loadLatestData(),
      loadHistoryData()
    ])
  } catch (error) {
    showToast('数据加载失败')
  }
}

const loadLatestData = async () => {
  const success = await healthStore.getLatestHealth(userStore.user.userId)
  if (success && healthStore.healthData) {
    updateHealthDisplay(healthStore.healthData)
  }
}

const loadHistoryData = async () => {
  const success = await healthStore.getHealthHistory(userStore.user.userId)
  if (success) {
    historyList.value = healthStore.healthHistory
  }
}

const updateHealthDisplay = (data) => {
  if (!data) return;
  
  console.log('更新健康数据显示:', data);  // 添加日志
  
  healthData.value = healthData.value.map(item => {
    const value = data[item.type];
    return {
      ...item,
      value: value || '--'
    };
  });
}

const onSubmit = async () => {
  if (!userStore.user?.userId) {
    showToast('请先登录')
    router.push('/login')
    return
  }

  try {
    const healthData = {
      ...form,
      date: selectedDate.value
    }

    const success = await healthStore.addHealthData(healthData)
    if (success) {
      showToast('保存成功')
      await loadData()
      resetForm()
    } else {
      showToast('保存失败')
    }
  } catch (error) {
    showToast(error.message || '保存失败')
  }
}

const resetForm = () => {
  Object.keys(form).forEach(key => form[key] = '')
}

const showDatePicker = () => {
  showDatePickerPopup.value = true
}

const onDateConfirm = (date) => {
  selectedDate.value = date
  showDatePickerPopup.value = false
}

const showFilter = () => {
  showFilterPopup.value = true
}

const applyFilter = async () => {
  // TODO: 实现筛选逻辑
  showFilterPopup.value = false
}

const resetFilter = () => {
  filterTypes.value = []
}

const deleteRecord = (id) => {
  if (!id) {
    showToast('记录ID不能为空');
    return;
  }

  showDialog({
    title: '确认删除',
    message: '确定要删除这条记录吗？',
    showCancelButton: true
  }).then(async () => {
    try {
      const success = await healthStore.deleteHealthRecord(id);
      if (success) {
        showToast('删除成功');
        await loadHistoryData();
      } else {
        showToast('删除失败');
      }
    } catch (error) {
      showToast('删除失败');
    }
  });
}

const showTip = (type) => {
  const tips = {
    bloodPressure: '收缩压/舒张压，如：120/80',
    heartRate: '正常范围：60-100次/分',
    bloodSugar: '空腹正常范围：3.9-6.1mmol/L',
    weight: '请输入实际体重'
  }
  showToast(tips[type])
}
</script>

<style scoped>
.health-page {
  min-height: 100vh;
  background: var(--background-color);
  padding-bottom: 20px;
}

.card {
  margin: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.data-item {
  padding: 12px;
  text-align: center;
}

.data-value {
  font-size: 24px;
  font-weight: 500;
  color: var(--text-color);
}

.unit {
  font-size: 12px;
  margin-left: 4px;
}

.data-label {
  font-size: 14px;
  color: var(--text-color-light);
  margin-top: 4px;
}

.data-trend {
  font-size: 12px;
  margin-top: 4px;
}

.unit-text {
  font-size: 12px;
  color: var(--text-color-light);
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.history-date {
  width: 80px;
  font-size: 14px;
  color: var(--text-color-light);
}

.history-content {
  flex: 1;
  margin: 0 12px;
}

.history-data {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin: 4px 0;
}

.filter-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.filter-content {
  flex: 1;
  padding: 16px;
}

.filter-actions {
  padding: 16px;
}

.filter-actions .van-button {
  margin-bottom: 12px;
}
</style> 