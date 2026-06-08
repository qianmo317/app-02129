<template>
  <div class="current-weather" v-if="weather">
    <div class="weather-header">
      <div class="city-info">
        <h2 class="city-name">{{ cityName }}</h2>
        <p class="weather-desc">{{ weatherInfo.text }}</p>
      </div>
      <WeatherIcon :code="weather.weatherCode" size="64px" />
    </div>

    <div class="temperature">
      <span class="temp-value">{{ weather.temperature }}</span>
      <span class="temp-unit">°C</span>
    </div>

    <div class="weather-details">
      <div class="detail-item">
        <el-icon class="detail-icon"><Drizzling /></el-icon>
        <span class="detail-label">湿度</span>
        <span class="detail-value">{{ weather.humidity }}%</span>
      </div>
      <div class="detail-item">
        <el-icon class="detail-icon"><WindPower /></el-icon>
        <span class="detail-label">风力</span>
        <span class="detail-value">{{ windLevel }}</span>
      </div>
      <div class="detail-item">
        <el-icon class="detail-icon"><Compass /></el-icon>
        <span class="detail-label">风向</span>
        <span class="detail-value">{{ windDirection }}</span>
      </div>
    </div>
  </div>

  <!-- 空状态 -->
  <div class="current-weather empty-state" v-else>
    <div class="empty-icon-wrapper">
      <el-icon class="empty-icon"><Cloudy /></el-icon>
    </div>
    <p class="empty-title">暂无天气数据</p>
    <p class="empty-desc">搜索城市查看实时天气</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Drizzling, Compass, Cloudy } from '@element-plus/icons-vue'
import WeatherIcon from './WeatherIcon.vue'
import { getWeatherInfo, getWindDirection, getWindLevel } from '../utils/weatherCode'

// 风力图标占位
const WindPower = Drizzling

const props = defineProps({
  weather: {
    type: Object,
    default: null
  },
  cityName: {
    type: String,
    default: ''
  }
})

const weatherInfo = computed(() => {
  if (!props.weather) return { text: '', emoji: '' }
  return getWeatherInfo(props.weather.weatherCode)
})

const windDirection = computed(() => {
  if (!props.weather) return ''
  return getWindDirection(props.weather.windDirection)
})

const windLevel = computed(() => {
  if (!props.weather) return ''
  return getWindLevel(props.weather.windSpeed)
})
</script>

<style scoped>
.current-weather {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--border-light);
  transition: box-shadow var(--transition-base);
}

.current-weather:hover {
  box-shadow: var(--shadow-md);
}

/* 空状态样式 */
.current-weather.empty-state {
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

/* 天气头部 */
.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4);
}

.city-info {
  text-align: left;
}

.city-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
  line-height: var(--line-height-tight);
}

.weather-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 温度显示 */
.temperature {
  text-align: center;
  margin: var(--spacing-6) 0;
}

.temp-value {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: 1;
}

.temp-unit {
  font-size: var(--font-size-xl);
  color: var(--text-secondary);
  vertical-align: top;
  margin-left: var(--spacing-1);
}

/* 天气详情 */
.weather-details {
  display: flex;
  justify-content: space-around;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border-light);
  background: var(--bg-section);
  margin: 0 calc(var(--spacing-6) * -1) calc(var(--spacing-6) * -1);
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-1);
}

.detail-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.detail-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.detail-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

/* 响应式 */
@media (max-width: 480px) {
  .weather-header {
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;
  }

  .city-info {
    text-align: center;
    margin-top: var(--spacing-3);
  }

  .temperature {
    margin: var(--spacing-4) 0;
  }

  .temp-value {
    font-size: var(--font-size-4xl);
  }
}
</style>
