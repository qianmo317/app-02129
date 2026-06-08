/**
 * @fileoverview 防抖 Hook
 * @description 提供防抖功能，用于优化频繁触发的操作（如搜索输入）
 */

import { ref, watch } from 'vue'

/**
 * 防抖 Hook
 * @description 对值变化进行防抖处理，延迟指定时间后才更新
 *
 * @param {import('vue').Ref} value - 需要防抖的响应式值
 * @param {number} [delay=300] - 防抖延迟时间（毫秒）
 * @returns {import('vue').Ref} 防抖后的值
 *
 * @example
 * const searchText = ref('')
 * const debouncedText = useDebounce(searchText, 300)
 *
 * // 监听防抖后的值进行搜索
 * watch(debouncedText, (newValue) => {
 *   if (newValue) searchCity(newValue)
 * })
 */
export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)
  let timer = null

  watch(value, (newValue) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

/**
 * 防抖函数 Hook
 * @description 返回一个防抖处理后的函数
 *
 * @param {Function} fn - 需要防抖的函数
 * @param {number} [delay=300] - 防抖延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 *
 * @example
 * const search = async (query) => {
 *   const results = await searchCity(query)
 *   // ...
 * }
 * const debouncedSearch = useDebounceFn(search, 300)
 */
export function useDebounceFn(fn, delay = 300) {
  let timer = null

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export default useDebounce
