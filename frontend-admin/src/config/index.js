/**
 * @fileoverview 应用配置文件
 * @description 集中管理环境变量和应用配置，便于不同环境切换
 */

/**
 * API 配置
 * @description 通过环境变量配置 API 地址，支持开发/测试/生产环境切换
 */
export const apiConfig = {
  /** 地理编码 API 基础地址 */
  geoApiBaseUrl: import.meta.env.VITE_GEO_API_URL || 'https://geocoding-api.open-meteo.com/v1',

  /** 天气预报 API 基础地址 */
  weatherApiBaseUrl: import.meta.env.VITE_WEATHER_API_URL || 'https://api.open-meteo.com/v1',

  /** API 请求超时时间（毫秒） */
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000
}

/**
 * 搜索配置
 */
export const searchConfig = {
  /** 搜索防抖延迟（毫秒） */
  debounceDelay: parseInt(import.meta.env.VITE_SEARCH_DEBOUNCE) || 300,

  /** 搜索结果最大数量 */
  maxResults: parseInt(import.meta.env.VITE_SEARCH_MAX_RESULTS) || 10,

  /** 搜索历史最大保存数量 */
  maxHistoryItems: parseInt(import.meta.env.VITE_MAX_HISTORY) || 10
}

/**
 * 缓存配置
 */
export const cacheConfig = {
  /** 天气数据缓存时间（毫秒），默认 5 分钟 */
  weatherCacheTTL: parseInt(import.meta.env.VITE_WEATHER_CACHE_TTL) || 5 * 60 * 1000,

  /** 是否启用缓存 */
  enableCache: import.meta.env.VITE_ENABLE_CACHE !== 'false'
}

/**
 * 应用配置
 */
export const appConfig = {
  /** 应用名称 */
  appName: import.meta.env.VITE_APP_NAME || '天气预报',

  /** 是否为开发环境 */
  isDev: import.meta.env.DEV,

  /** 是否为生产环境 */
  isProd: import.meta.env.PROD
}

export default {
  api: apiConfig,
  search: searchConfig,
  cache: cacheConfig,
  app: appConfig
}
