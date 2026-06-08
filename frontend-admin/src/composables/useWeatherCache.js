/**
 * @fileoverview 天气数据缓存 Hook
 * @description 提供天气数据的内存缓存功能，减少重复 API 请求
 */

import { ref } from 'vue'
import { cacheConfig } from '../config'

/**
 * 缓存项结构
 * @typedef {Object} CacheItem
 * @property {any} data - 缓存的数据
 * @property {number} timestamp - 缓存时间戳
 * @property {number} ttl - 缓存有效期（毫秒）
 */

/** @type {Map<string, CacheItem>} */
const cache = new Map()

/**
 * 天气数据缓存 Hook
 * @description 提供天气数据的缓存读写功能，支持 TTL 过期机制
 *
 * @returns {Object} 缓存操作方法
 *
 * @example
 * const { get, set, has, clear } = useWeatherCache()
 *
 * // 检查缓存
 * const cacheKey = `${lat}-${lon}`
 * if (has(cacheKey)) {
 *   return get(cacheKey)
 * }
 *
 * // 设置缓存
 * const data = await fetchWeather(lat, lon)
 * set(cacheKey, data)
 */
export function useWeatherCache() {
  const isEnabled = ref(cacheConfig.enableCache)
  const defaultTTL = cacheConfig.weatherCacheTTL

  /**
   * 生成缓存键
   * @param {number} latitude - 纬度
   * @param {number} longitude - 经度
   * @returns {string} 缓存键
   */
  const generateKey = (latitude, longitude) => {
    // 保留 2 位小数，避免精度问题导致缓存失效
    const lat = latitude.toFixed(2)
    const lon = longitude.toFixed(2)
    return `weather_${lat}_${lon}`
  }

  /**
   * 检查缓存项是否过期
   * @param {CacheItem} item - 缓存项
   * @returns {boolean} 是否过期
   */
  const isExpired = (item) => {
    if (!item) return true
    return Date.now() - item.timestamp > item.ttl
  }

  /**
   * 获取缓存数据
   * @param {string} key - 缓存键
   * @returns {any|null} 缓存数据，如果不存在或已过期返回 null
   */
  const get = (key) => {
    if (!isEnabled.value) return null

    const item = cache.get(key)
    if (!item || isExpired(item)) {
      cache.delete(key)
      return null
    }
    return item.data
  }

  /**
   * 设置缓存数据
   * @param {string} key - 缓存键
   * @param {any} data - 要缓存的数据
   * @param {number} [ttl] - 缓存有效期（毫秒），默认使用配置值
   */
  const set = (key, data, ttl = defaultTTL) => {
    if (!isEnabled.value) return

    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * 检查缓存是否存在且有效
   * @param {string} key - 缓存键
   * @returns {boolean} 是否存在有效缓存
   */
  const has = (key) => {
    if (!isEnabled.value) return false

    const item = cache.get(key)
    if (!item || isExpired(item)) {
      cache.delete(key)
      return false
    }
    return true
  }

  /**
   * 清除所有缓存
   */
  const clear = () => {
    cache.clear()
  }

  /**
   * 清除过期缓存
   */
  const clearExpired = () => {
    for (const [key, item] of cache.entries()) {
      if (isExpired(item)) {
        cache.delete(key)
      }
    }
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 缓存统计
   */
  const getStats = () => {
    clearExpired()
    return {
      size: cache.size,
      enabled: isEnabled.value
    }
  }

  return {
    generateKey,
    get,
    set,
    has,
    clear,
    clearExpired,
    getStats,
    isEnabled
  }
}

export default useWeatherCache
