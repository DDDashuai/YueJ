<template>
  <div class="medicine-reminder">
    <van-nav-bar title="用药助手" left-arrow @click-left="onClickLeft" />
    
    <van-tabs v-model:active="activeTab" sticky style="margin-top: 20px">
      <van-tab title="添加提醒" style="margin-top: 20px">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="form.medicineName"
              name="medicineName"
              label="药品名称"
              placeholder="请输入药品名称"
              :rules="[{ required: true, message: '请填写药品名称' }]"
            />
            
            <van-field
              v-model="form.dosage"
              name="dosage"
              label="用药剂量"
              placeholder="请输入用药剂量"
              :rules="[{ required: true, message: '请填写用药剂量' }]"
            />
            
            <van-field
              v-model="form.frequency"
              name="frequency"
              label="服药频率"
              placeholder="如：每天三次"
              :rules="[{ required: true, message: '请填写服药频率' }]"
            />
            
            <van-field
              v-model="form.notes"
              name="notes"
              label="备注"
              type="textarea"
              placeholder="请输入备注信息"
              rows="2"
            />
          </van-cell-group>
          
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              添加提醒
            </van-button>
          </div>
        </van-form>
      </van-tab>
      
      <van-tab title="提醒列表">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell-group v-for="item in reminderList" :key="item.reminderId" inset style="margin-top: 20px">
              <van-cell :title="item.medicineName" :label="item.frequency">
                <template #right-icon>
                  <van-tag :type="item.status === 'ACTIVE' ? 'success' : 'warning'">
                    {{ item.status === 'ACTIVE' ? '进行中' : '已完成' }}
                  </van-tag>
                </template>
              </van-cell>
              <van-cell title="用药剂量" :value="item.dosage" />
              <van-cell title="下次提醒" :value="formatDateTime(item.nextRemindTime)" />
              <van-cell title="备注" :label="item.notes" />
              <van-cell>
                <template #right-icon>
                  <van-button size="small" type="danger" @click="deleteReminder(item.reminderId)">
                    删除
                  </van-button>
                </template>
              </van-cell>
            </van-cell-group>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showFailToast, showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { useMedicineStore } from '@/stores/medicine'

const router = useRouter()
const userStore = useUserStore()
const medicineStore = useMedicineStore()

const activeTab = ref(0)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const reminderList = ref([])

const form = reactive({
  medicineName: '',
  dosage: '',
  frequency: '',
  notes: ''
})

const onClickLeft = () => {
  router.back()
}

const formatDateTime = (datetime) => {
  return new Date(datetime).toLocaleString()
}

const onSubmit = async (values) => {
  try {
    if (!userStore.user?.userId) {
      showToast('请先登录');
      router.push('/login');
      return;
    }

    const reminderData = {
      medicineName: form.medicineName,
      dosage: form.dosage,
      frequency: form.frequency,
      notes: form.notes,
      nextRemindTime: new Date().toISOString()
    };

    console.log('提交用药提醒:', reminderData);
    const success = await medicineStore.addReminder(reminderData);
    
    if (success) {
      showToast('添加成功');
      resetForm();
      activeTab.value = 1;
      await refreshList();
    } else {
      showToast('添加失败');
    }
  } catch (error) {
    showToast(error.message || '添加失败');
  }
};

const resetForm = () => {
  form.medicineName = '';
  form.dosage = '';
  form.frequency = '';
  form.notes = '';
};

const refreshList = async () => {
  loading.value = true;
  finished.value = false;
  reminderList.value = [];
  
  try {
    if (userStore.user?.userId) {
      await medicineStore.getReminders(userStore.user.userId);
      reminderList.value = medicineStore.reminders;
    }
  } catch (error) {
    showToast('获取数据失败');
  } finally {
    loading.value = false;
    finished.value = true;
  }
};

const onRefresh = async () => {
  refreshing.value = true;
  try {
    await refreshList();
  } finally {
    refreshing.value = false;
  }
};

const onLoad = async () => {
  if (!loading.value) {
    await refreshList();
  }
};

onMounted(async () => {
  await refreshList();
});

const deleteReminder = async (reminderId) => {
  try {
    // TODO: 调用API删除提醒
    showSuccessToast('删除成功')
    onRefresh()
  } catch (error) {
    showFailToast('删除失败')
  }
}
</script>

<style scoped>
.medicine-reminder {
  min-height: 100vh;
  background: #f7f8fa;
}
</style> 