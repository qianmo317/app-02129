import { ref, watch } from 'vue'

/**
 * 本地存储 Hook
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @returns {object} { value, remove }
 */
export function useLocalStorage(key, defaultValue) {
  // 从 localStorage 读取初始值
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`读取 localStorage[${key}] 失败:`, error)
      return defaultValue
    }
  }

  const value = ref(getStoredValue())

  // 监听值变化，自动保存到 localStorage
  watch(
    value,
    (newValue) => {
      try {
        if (newValue === null || newValue === undefined) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(newValue))
        }
      } catch (error) {
        console.error(`保存 localStorage[${key}] 失败:`, error)
      }
    },
    { deep: true }
  )

  // 删除存储
  const remove = () => {
    value.value = defaultValue
    localStorage.removeItem(key)
  }

  return {
    value,
    remove
  }
}
