import { ref } from 'vue'
import { showToast } from 'vant'

export function useDataList(fetchData) {
  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)
  const dataList = ref([])

  const refreshList = async () => {
    loading.value = true
    finished.value = false
    dataList.value = []
    
    try {
      const data = await fetchData()
      dataList.value = data
    } catch (error) {
      showToast('获取数据失败')
    } finally {
      loading.value = false
      finished.value = true
    }
  }

  const onRefresh = async () => {
    refreshing.value = true
    try {
      await refreshList()
    } finally {
      refreshing.value = false
    }
  }

  const onLoad = async () => {
    if (!loading.value) {
      await refreshList()
    }
  }

  return {
    loading,
    finished,
    refreshing,
    dataList,
    refreshList,
    onRefresh,
    onLoad
  }
} 