<template>
  <div class="forecast-list" v-if="forecast && forecast.length > 0">
    <h3 class="forecast-title">未来天气预报</h3>
    <div class="forecast-items">
      <div
        v-for="(day, index) in forecast"
        :key="day.date"
        class="forecast-item"
        :class="{ 'is-today': index === 0 }"
      >
        <span class="forecast-date">{{ formatDate(day.date) }}</span>
        <WeatherIcon :code="day.weatherCode" size="28px" />
        <span class="forecast-desc">{{ getWeatherInfo(day.weatherCode).text }}</span>
        <div class="forecast-temp">
          <span class="temp-high">{{ day.tempMax }}°</span>
          <span class="temp-divider">/</span>
          <span class="temp-low">{{ day.tempMin }}°</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 空状态 -->
  <div class="forecast-list empty-state" v-else>
    <div class="empty-icon-wrapper">
      <el-icon class="empty-icon"><Calendar /></el-icon>
    </div>
    <p class="empty-title">暂无预报数据</p>
    <p class="empty-desc">搜索城市查看未来天气</p>
  </div>
</template>

<script setup>
import { Calendar } from '@element-plus/icons-vue'
import WeatherIcon from './WeatherIcon.vue'
import { getWeatherInfo, formatDate } from '../utils/weatherCode'

defineProps({
  forecast: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.forecast-list {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--border-light);
  transition: box-shadow var(--transition-base);
}

.forecast-list:hover {
  box-shadow: var(--shadow-md);
}

/* 空状态 */
.forecast-list.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  text-align: center;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  background: var(--bg-section);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-4);
}

.empty-icon {
  font-size: 40px;
  color: var(--text-placeholder);
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-1);
}

.empty-desc {
  font-size: var(--font-size-sm);
  color: var(--text-placeholder);
}

/* 标题 */
.forecast-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--border-light);
}

/* 预报列表 */
.forecast-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.forecast-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-base);
  background: var(--bg-section);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.forecast-item:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color);
  transform: translateX(4px);
}

.forecast-item.is-today {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.08) 0%, rgba(64, 158, 255, 0.04) 100%);
  border: 1px solid rgba(64, 158, 255, 0.2);
}

.forecast-item.is-today:hover {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.12) 0%, rgba(64, 158, 255, 0.06) 100%);
}

.forecast-date {
  width: 80px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  flex-shrink: 0;
}

.forecast-desc {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-left: var(--spacing-3);
}

.forecast-temp {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.temp-high {
  color: var(--color-error);
}

.temp-divider {
  color: var(--text-placeholder);
}

.temp-low {
  color: var(--color-info);
}

/* 响应式 */
@media (max-width: 480px) {
  .forecast-item {
    flex-wrap: wrap;
    gap: var(--spacing-2);
    padding: var(--spacing-3);
  }

  .forecast-date {
    width: 60px;
    font-size: var(--font-size-xs);
  }

  .forecast-desc {
    order: 3;
    width: 100%;
    margin-left: 0;
    margin-top: var(--spacing-1);
    font-size: var(--font-size-xs);
  }
}
</style>
