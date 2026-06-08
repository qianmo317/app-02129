<template>
  <div class="weather-app">
    <!-- Header 区域 -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">
          <span class="title-icon">🌤️</span>
          <span>天气预报</span>
        </h1>
        <p class="app-subtitle">查询全球城市实时天气</p>
      </div>
    </header>

    <!-- Main 主内容区域 -->
    <main class="app-main">
      <!-- 搜索区域 -->
      <section class="search-section">
        <SearchBox @select="handleCitySelect" />
      </section>

      <!-- 搜索历史区域 -->
      <section class="history-section" v-if="searchHistory.length > 0">
        <SearchHistory
          :history="searchHistory"
          @select="handleCitySelect"
          @clear="clearHistory"
        />
      </section>

      <!-- 加载状态 -->
      <section class="loading-section" v-if="loading">
        <div class="loading-card">
          <el-skeleton :rows="5" animated />
        </div>
      </section>

      <!-- 天气展示区域 -->
      <section class="weather-section" v-else>
        <div class="weather-grid">
          <CurrentWeather
            :weather="currentWeather"
            :city-name="currentCity?.displayName || ''"
          />
          <ForecastList :forecast="forecastWeather" />
        </div>
      </section>
    </main>

    <!-- Footer 区域 -->
    <footer class="app-footer">
      <p class="footer-text">
        数据来源:
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="访问 Open-Meteo 官网"
        >
          Open-Meteo
        </a>
        <span class="footer-divider">|</span>
        <a
          href="https://github.com/open-meteo/open-meteo"
          target="_blank"
          rel="noopener noreferrer"
          title="查看 Open-Meteo GitHub"
        >
          GitHub
        </a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SearchBox from './components/SearchBox.vue'
import SearchHistory from './components/SearchHistory.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import ForecastList from './components/ForecastList.vue'
import { getWeather } from './api/weather'
import { useLocalStorage } from './composables/useLocalStorage'
import { useWeatherCache } from './composables/useWeatherCache'
import { searchConfig } from './config'

// 状态
const loading = ref(false)
const currentCity = ref(null)
const weatherData = ref(null)

// 搜索历史（本地存储）
const { value: searchHistory, remove: clearHistory } = useLocalStorage('weather-search-history', [])

// 天气缓存
const { generateKey, get: getCache, set: setCache, has: hasCache } = useWeatherCache()

// 计算属性
const currentWeather = computed(() => weatherData.value?.current || null)
const forecastWeather = computed(() => weatherData.value?.daily || [])

// 选择城市
const handleCitySelect = async (city) => {
  if (!city) return

  loading.value = true
  currentCity.value = city

  try {
    // 检查缓存
    const cacheKey = generateKey(city.latitude, city.longitude)
    if (hasCache(cacheKey)) {
      weatherData.value = getCache(cacheKey)
      ElMessage.success(`已加载 ${city.name} 的天气数据（缓存）`)
    } else {
      // 请求新数据
      const data = await getWeather(city.latitude, city.longitude)
      weatherData.value = data
      // 存入缓存
      setCache(cacheKey, data)
      ElMessage.success(`已加载 ${city.name} 的天气数据`)
    }

    // 添加到搜索历史
    addToHistory(city)
  } catch (error) {
    ElMessage.error(error.message || '获取天气失败')
    weatherData.value = null
  } finally {
    loading.value = false
  }
}

// 添加到搜索历史
const addToHistory = (city) => {
  const history = searchHistory.value

  // 移除已存在的相同城市
  const filtered = history.filter(item => item.id !== city.id)

  // 添加到开头
  filtered.unshift({
    id: city.id,
    name: city.name,
    displayName: city.displayName,
    latitude: city.latitude,
    longitude: city.longitude
  })

  // 最多保留配置的数量
  searchHistory.value = filtered.slice(0, searchConfig.maxHistoryItems)
}
</script>

<style scoped>
.weather-app {
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

/* Header 样式 */
.app-header {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8) var(--spacing-6);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.app-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: #ffffff;
  margin-bottom: var(--spacing-2);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.title-icon {
  font-size: 1.2em;
  line-height: 1;
}

.app-subtitle {
  font-size: var(--font-size-base);
  color: rgba(255, 255, 255, 0.9);
  font-weight: var(--font-weight-normal);
}

/* Main 区域 */
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

/* 各 Section 样式 */
.search-section,
.history-section,
.loading-section,
.weather-section {
  padding: 0;
}

.loading-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-base);
}

/* 天气网格布局 */
.weather-grid {
  display: grid;
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .weather-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Footer 样式 */
.app-footer {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4) var(--spacing-6);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.footer-text {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.85);
}

.footer-text a {
  color: #ffffff;
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.footer-text a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.footer-divider {
  margin: 0 var(--spacing-2);
  opacity: 0.5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-header {
    padding: var(--spacing-6) var(--spacing-4);
  }

  .app-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
