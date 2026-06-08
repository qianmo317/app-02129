<template>
  <div class="search-box-wrapper">
    <div class="search-box">
      <el-autocomplete
        v-model="searchText"
        :fetch-suggestions="handleSearch"
        :trigger-on-focus="false"
        placeholder="输入城市名称搜索..."
        clearable
        :loading="loading"
        @select="handleSelect"
        @keyup.enter="handleEnter"
        class="search-input"
        popper-class="search-suggestions"
      >
        <template #prefix>
          <el-icon class="search-prefix-icon"><Search /></el-icon>
        </template>
        <template #default="{ item }">
          <div class="suggestion-item">
            <el-icon class="suggestion-icon"><Location /></el-icon>
            <span class="suggestion-text">{{ item.displayName }}</span>
          </div>
        </template>
      </el-autocomplete>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSearchClick"
        class="search-btn"
      >
        <el-icon v-if="!loading"><Search /></el-icon>
        <span>搜索</span>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Location } from '@element-plus/icons-vue'
import { searchCity } from '../api/weather'
import { useDebounceFn } from '../composables/useDebounce'
import { searchConfig } from '../config'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['select'])

const searchText = ref('')
const loading = ref(false)
const lastResults = ref([])

// 防抖搜索函数
const debouncedFetch = useDebounceFn(async (query, callback) => {
  if (!query || query.trim().length < 1) {
    callback([])
    return
  }

  loading.value = true
  try {
    const results = await searchCity(query.trim())
    lastResults.value = results
    callback(results)
  } catch (error) {
    ElMessage.error(error.message || '搜索失败')
    callback([])
  } finally {
    loading.value = false
  }
}, searchConfig.debounceDelay)

// 搜索建议（带防抖）
const handleSearch = (query, callback) => {
  debouncedFetch(query, callback)
}

// 选择城市
const handleSelect = (item) => {
  emit('select', item)
}

// 回车搜索
const handleEnter = () => {
  if (lastResults.value.length > 0) {
    handleSelect(lastResults.value[0])
  } else if (searchText.value.trim()) {
    handleSearchClick()
  }
}

// 点击搜索按钮
const handleSearchClick = async () => {
  if (!searchText.value.trim()) {
    ElMessage.warning('请输入城市名称')
    return
  }

  loading.value = true
  try {
    const results = await searchCity(searchText.value.trim())
    if (results.length > 0) {
      handleSelect(results[0])
    } else {
      ElMessage.warning('未找到该城市，请检查输入')
    }
  } catch (error) {
    ElMessage.error(error.message || '搜索失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.search-box-wrapper {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--border-light);
}

.search-box {
  display: flex;
  gap: var(--spacing-3);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-base);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}

.search-input :deep(.el-input__inner) {
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.search-input :deep(.el-input__inner::placeholder) {
  color: var(--text-placeholder);
}

.search-prefix-icon {
  color: var(--text-secondary);
  font-size: 18px;
}

.search-btn {
  border-radius: var(--radius-full);
  padding: var(--spacing-2) var(--spacing-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  height: auto;
  min-width: 100px;
  transition: all var(--transition-base);
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.search-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* 搜索建议项 */
.suggestion-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1) 0;
}

.suggestion-icon {
  color: var(--primary-color);
  font-size: 16px;
  flex-shrink: 0;
}

.suggestion-text {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

/* 响应式 */
@media (max-width: 480px) {
  .search-box-wrapper {
    padding: var(--spacing-4);
  }

  .search-box {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }
}
</style>
