/**
 * @fileoverview 天气 API 接口封装
 * @description 提供城市搜索和天气数据获取功能，使用 Open-Meteo 免费 API
 * @author Weather App Team
 * @version 1.0.0
 */

import axios from 'axios'

// ============================================================================
// API 实例配置
// ============================================================================

const geoApi = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
  timeout: 10000
})

const weatherApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000
})

// ============================================================================
// 错误处理
// ============================================================================

const ErrorType = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  API: 'API_ERROR',
  PARSE: 'PARSE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

class ApiError extends Error {
  constructor(message, type, originalError = null) {
    super(message)
    this.name = 'ApiError'
    this.type = type
    this.originalError = originalError
  }
}

function parseAxiosError(error, context) {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return new ApiError(`${context}：请求超时，请检查网络连接后重试`, ErrorType.TIMEOUT, error)
  }
  if (!error.response) {
    return new ApiError(`${context}：网络连接失败，请检查网络设置`, ErrorType.NETWORK, error)
  }
  const status = error.response.status
  const statusMessages = {
    400: '请求参数错误',
    404: '请求的资源不存在',
    429: '请求过于频繁，请稍后重试',
    500: '服务器内部错误',
    503: '服务暂时不可用'
  }
  return new ApiError(`${context}：${statusMessages[status] || '服务器错误'}`, ErrorType.API, error)
}

// ============================================================================
// 中国行政区划数据
// ============================================================================

/**
 * 中国所有省级行政区（用于验证搜索结果）
 */
const chinaProvinces = [
  // 直辖市
  '北京', '天津', '上海', '重庆',
  // 省份
  '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西',
  '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西',
  '甘肃', '青海', '台湾',
  // 自治区
  '内蒙古', '广西', '西藏', '宁夏', '新疆',
  // 特别行政区
  '香港', '澳门'
]

/**
 * 省份名到省会城市的映射（用于搜索省份时返回省会）
 */
const provinceToCapital = {
  '河北': '石家庄', '山西': '太原', '辽宁': '沈阳', '吉林': '长春', '黑龙江': '哈尔滨',
  '江苏': '南京', '浙江': '杭州', '安徽': '合肥', '福建': '福州', '江西': '南昌',
  '山东': '济南', '河南': '郑州', '湖北': '武汉', '湖南': '长沙', '广东': '广州',
  '海南': '海口', '四川': '成都', '贵州': '贵阳', '云南': '昆明', '陕西': '西安',
  '甘肃': '兰州', '青海': '西宁', '台湾': '台北',
  '内蒙古': '呼和浩特', '广西': '南宁', '西藏': '拉萨', '宁夏': '银川', '新疆': '乌鲁木齐',
  '香港': '香港', '澳门': '澳门'
}

/**
 * 非城市关键词黑名单（这些词不应该返回搜索结果）
 */
const nonCityKeywords = [
  '东北', '华北', '华东', '华南', '华中', '西北', '西南',
  '东部', '西部', '南部', '北部', '中部',
  '长江', '黄河', '珠江', '淮河',
  '东方', '西方', '南方', '北方'
]

/**
 * 主要城市与正确省份的映射（用于精确匹配）
 */
const majorCityProvinceMap = {
  // 直辖市
  '北京': '北京', '上海': '上海', '天津': '天津', '重庆': '重庆',
  // 省会城市
  '石家庄': '河北', '太原': '山西', '沈阳': '辽宁', '长春': '吉林', '哈尔滨': '黑龙江',
  '南京': '江苏', '杭州': '浙江', '合肥': '安徽', '福州': '福建', '南昌': '江西',
  '济南': '山东', '郑州': '河南', '武汉': '湖北', '长沙': '湖南', '广州': '广东',
  '海口': '海南', '成都': '四川', '贵阳': '贵州', '昆明': '云南', '西安': '陕西',
  '兰州': '甘肃', '西宁': '青海', '呼和浩特': '内蒙古', '南宁': '广西', '拉萨': '西藏',
  '银川': '宁夏', '乌鲁木齐': '新疆',
  // 重要城市
  '深圳': '广东', '青岛': '山东', '大连': '辽宁', '厦门': '福建', '苏州': '江苏',
  '无锡': '江苏', '宁波': '浙江', '温州': '浙江', '东莞': '广东', '佛山': '广东',
  '珠海': '广东', '大同': '山西', '洛阳': '河南', '开封': '河南', '桂林': '广西',
  '三亚': '海南', '秦皇岛': '河北', '烟台': '山东', '威海': '山东', '泉州': '福建',
  '常州': '江苏', '徐州': '江苏', '扬州': '江苏', '南通': '江苏', '嘉兴': '浙江',
  '绍兴': '浙江', '金华': '浙江', '台州': '浙江', '芜湖': '安徽', '漳州': '福建',
  '潍坊': '山东', '淄博': '山东', '临沂': '山东', '洛阳': '河南', '襄阳': '湖北',
  '宜昌': '湖北', '岳阳': '湖南', '株洲': '湖南', '湘潭': '湖南', '惠州': '广东',
  '中山': '广东', '江门': '广东', '汕头': '广东', '湛江': '广东', '柳州': '广西',
  '绵阳': '四川', '德阳': '四川', '宜宾': '四川', '泸州': '四川', '遵义': '贵州',
  '大理': '云南', '丽江': '云南', '咸阳': '陕西', '宝鸡': '陕西'
}

// ============================================================================
// 城市搜索过滤逻辑
// ============================================================================

/**
 * 规范化省份名称（去除"省"、"市"等后缀）
 */
function normalizeProvinceName(name) {
  if (!name) return ''
  return name.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔/g, '').trim()
}

/**
 * 检查是否是有效的中国省份
 */
function isValidChinaProvince(admin1) {
  const normalized = normalizeProvinceName(admin1)
  return chinaProvinces.some(p => normalized.includes(p) || p.includes(normalized))
}

/**
 * 检查城市名是否为中文
 */
function isChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str)
}

/**
 * 过滤和规范化搜索结果
 * - 对于主要城市，只返回正确省份的结果
 * - 对于中国城市，只保留有效省份的结果
 * - 过滤掉异常数据（如英文名、错误省份）
 */
function filterCityResults(results, searchName) {
  const trimmedName = searchName.trim()

  // 1. 如果搜索的是主要城市，只返回正确省份的那一个
  if (majorCityProvinceMap[trimmedName]) {
    const expectedProvince = majorCityProvinceMap[trimmedName]

    // 遍历结果找到正确的城市
    for (const city of results) {
      // 城市名匹配（支持"大同"和"大同市"两种形式）
      const cityNameNormalized = city.name.replace(/市$/, '')
      if (cityNameNormalized !== trimmedName) continue

      // 省份匹配
      const normalizedAdmin = normalizeProvinceName(city.admin1)
      const normalizedExpected = normalizeProvinceName(expectedProvince)

      if (normalizedAdmin === normalizedExpected ||
          normalizedAdmin.includes(normalizedExpected) ||
          normalizedExpected.includes(normalizedAdmin)) {
        // 找到正确的城市，只返回这一个
        return [{
          ...city,
          name: trimmedName,
          displayName: `${trimmedName}, ${city.admin1}, ${city.country}`
        }]
      }
    }
  }

  // 2. 对于中国的搜索结果，过滤掉无效省份和异常数据
  const filtered = results.filter(city => {
    // 如果是中国城市
    if (city.country === '中国' || city.country === 'China') {
      // 城市名必须是中文
      if (!isChinese(city.name)) return false
      // 省份必须是有效的中国省份
      if (!isValidChinaProvince(city.admin1)) return false
      // 过滤掉省份名中包含 "or" 的异常数据
      if (city.admin1 && city.admin1.includes(' or ')) return false
    }
    return true
  })

  // 3. 如果搜索词是中文，优先显示中国城市
  if (isChinese(trimmedName)) {
    const chinaCities = filtered.filter(c => c.country === '中国' || c.country === 'China')
    if (chinaCities.length > 0) {
      return chinaCities
    }
  }

  return filtered
}

// ============================================================================
// 城市搜索 API
// ============================================================================

export async function searchCity(name) {
  if (!name || typeof name !== 'string') return []

  let trimmedName = name.trim()
  if (trimmedName.length === 0) return []

  // 检查是否是非城市关键词
  if (nonCityKeywords.includes(trimmedName)) {
    return []
  }

  // 如果搜索的是省份名，转换为搜索省会城市
  if (provinceToCapital[trimmedName]) {
    trimmedName = provinceToCapital[trimmedName]
  }

  try {
    // 对于主要城市，同时搜索带"市"和不带"市"的版本
    let searchNames = [trimmedName]
    if (majorCityProvinceMap[trimmedName] && !trimmedName.endsWith('市')) {
      searchNames.push(trimmedName + '市')
    }
    if (trimmedName.endsWith('市')) {
      searchNames.push(trimmedName.replace(/市$/, ''))
    }

    // 并行搜索所有变体
    const allResults = []
    for (const searchName of searchNames) {
      const response = await geoApi.get('/search', {
        params: {
          name: searchName,
          count: 20,
          language: 'zh',
          format: 'json'
        }
      })
      if (response.data && response.data.results) {
        allResults.push(...response.data.results)
      }
    }

    if (allResults.length === 0) {
      return []
    }

    // 转换数据格式
    let cities = allResults.map(city => ({
      id: city.id,
      name: city.name,
      country: city.country || '',
      admin1: city.admin1 || '',
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population || 0,
      displayName: buildDisplayName(city.name, city.admin1, city.country)
    }))

    // 过滤和规范化结果
    cities = filterCityResults(cities, trimmedName)

    // 去重
    const seen = new Set()
    cities = cities.filter(city => {
      const key = `${city.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return cities.slice(0, 10)

  } catch (error) {
    console.error('[searchCity] 搜索城市失败:', error)
    throw parseAxiosError(error, '搜索城市失败')
  }
}

function buildDisplayName(name, admin1, country) {
  const parts = [name]
  if (admin1 && !admin1.includes(' or ')) parts.push(admin1)
  if (country) parts.push(country)
  return parts.join(', ')
}

// ============================================================================
// 天气数据 API
// ============================================================================

export async function getWeather(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new ApiError('获取天气失败：无效的坐标参数', ErrorType.PARSE)
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new ApiError('获取天气失败：坐标超出有效范围', ErrorType.PARSE)
  }

  try {
    const response = await weatherApi.get('/forecast', {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        forecast_days: 4
      }
    })

    const data = response.data
    if (!data || !data.current || !data.daily) {
      throw new ApiError('获取天气失败：返回数据格式异常', ErrorType.PARSE)
    }

    return {
      current: {
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: data.current.wind_direction_10m
      },
      daily: data.daily.time.slice(0, 4).map((date, index) => ({
        date,
        weatherCode: data.daily.weather_code[index],
        tempMax: Math.round(data.daily.temperature_2m_max[index]),
        tempMin: Math.round(data.daily.temperature_2m_min[index])
      }))
    }

  } catch (error) {
    if (error instanceof ApiError) throw error
    console.error('[getWeather] 获取天气失败:', error)
    throw parseAxiosError(error, '获取天气数据失败')
  }
}

export { ErrorType, ApiError }
