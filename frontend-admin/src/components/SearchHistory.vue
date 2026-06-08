<template>
  <div class="search-history" v-if="history && history.length > 0">
    <div class="history-header">
      <h3 class="history-title">
        <el-icon class="history-icon"><Clock /></el-icon>
        <span>搜索历史</span>
      </h3>
      <el-button
        type="danger"
        text
        size="small"
        class="clear-btn"
        @click="handleClear"
      >
        <el-icon><Delete /></el-icon>
        <span>清除</span>
      </el-button>
    </div>
    <div class="history-tags">
      <el-tag
        v-for="city in history"
        :key="city.id"
        class="history-tag"
        effect="plain"
        @click="handleClick(city)"
      >
        <el-icon class="tag-icon"><Location /></el-icon>
        <span class="tag-text">{{ city.name }}</span>
      </el-tag>
    </div>
  </div>
</template>

<script setup>
import { Clock, Delete, Location } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'clear'])

const handleClick = (city) => {
  emit('select', city)
}

const handleClear = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清除所有搜索历史吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    emit('clear')
    ElMessage.success('历史记录已清除')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.search-history {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4) var(--spacing-5);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--border-light);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.history-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.history-icon {
  font-size: 16px;
}

.clear-btn {
  font-size: var(--font-size-xs);
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  transform: scale(1.05);
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.history-tag {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--transition-base);
  border-radius: var(--radius-full);
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-regular);
}

.history-tag :deep(.el-tag__content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.history-tag:hover {
  background: var(--primary-color);
  color: #ffffff;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.history-tag:active {
  transform: translateY(0);
}

.tag-icon {
  flex-shrink: 0;
  margin-right: var(--spacing-1);
  font-size: 12px;
}

.tag-text {
  flex-shrink: 0;
  font-weight: var(--font-weight-normal);
}
</style>
