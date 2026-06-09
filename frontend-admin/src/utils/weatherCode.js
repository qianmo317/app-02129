/**
 * WMO 天气代码映射
 * 参考: https://open-meteo.com/en/docs
 */
export const weatherCodeMap = {
  0: { text: '晴天', icon: 'Sunny', emoji: '☀️' },
  1: { text: '大部晴朗', icon: 'Sunny', emoji: '🌤️' },
  2: { text: '多云', icon: 'Cloudy', emoji: '⛅' },
  3: { text: '阴天', icon: 'Cloudy', emoji: '☁️' },
  45: { text: '雾', icon: 'Cloudy', emoji: '🌫️' },
  48: { text: '雾凇', icon: 'Cloudy', emoji: '🌫️' },
  51: { text: '小毛毛雨', icon: 'Pouring', emoji: '🌧️' },
  53: { text: '中毛毛雨', icon: 'Pouring', emoji: '🌧️' },
  55: { text: '大毛毛雨', icon: 'Pouring', emoji: '🌧️' },
  56: { text: '冻毛毛雨', icon: 'Pouring', emoji: '🌧️' },
  57: { text: '强冻毛毛雨', icon: 'Pouring', emoji: '🌧️' },
  61: { text: '小雨', icon: 'Pouring', emoji: '🌧️' },
  63: { text: '中雨', icon: 'Pouring', emoji: '🌧️' },
  65: { text: '大雨', icon: 'Pouring', emoji: '🌧️' },
  66: { text: '冻雨', icon: 'Pouring', emoji: '🌧️' },
  67: { text: '强冻雨', icon: 'Pouring', emoji: '🌧️' },
  71: { text: '小雪', icon: 'Pouring', emoji: '🌨️' },
  73: { text: '中雪', icon: 'Pouring', emoji: '🌨️' },
  75: { text: '大雪', icon: 'Pouring', emoji: '🌨️' },
  77: { text: '雪粒', icon: 'Pouring', emoji: '🌨️' },
  80: { text: '小阵雨', icon: 'Pouring', emoji: '🌦️' },
  81: { text: '中阵雨', icon: 'Pouring', emoji: '🌦️' },
  82: { text: '大阵雨', icon: 'Pouring', emoji: '🌦️' },
  85: { text: '小阵雪', icon: 'Pouring', emoji: '🌨️' },
  86: { text: '大阵雪', icon: 'Pouring', emoji: '🌨️' },
  95: { text: '雷暴', icon: 'Lightning', emoji: '⛈️' },
  96: { text: '雷暴伴小冰雹', icon: 'Lightning', emoji: '⛈️' },
  99: { text: '雷暴伴大冰雹', icon: 'Lightning', emoji: '⛈️' }
}

/**
 * 获取天气信息
 * @param {number} code - WMO 天气代码
 * @returns {object} 天气信息对象
 */
export function getWeatherInfo(code) {
  return weatherCodeMap[code] || { text: '未知', icon: 'Cloudy', emoji: '❓' }
}

/**
 * 获取风向描述
 * @param {number} degree - 风向角度
 * @returns {string} 风向描述
 */
export function getWindDirection(degree) {
  if (degree === null || degree === undefined) return '无风'

  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
  const index = Math.round(degree / 45) % 8
  return directions[index] + '风'
}

/**
 * 获取风力等级
 * @param {number} speed - 风速 (km/h)
 * @returns {string} 风力等级描述
 */
export function getWindLevel(speed) {
  if (speed < 1) return '无风'
  if (speed < 6) return '1级'
  if (speed < 12) return '2级'
  if (speed < 20) return '3级'
  if (speed < 29) return '4级'
  if (speed < 39) return '5级'
  if (speed < 50) return '6级'
  if (speed < 62) return '7级'
  if (speed < 75) return '8级'
  if (speed < 89) return '9级'
  if (speed < 103) return '10级'
  if (speed < 117) return '11级'
  return '12级以上'
}

/**
 * 获取本地时区的 YYYY-MM-DD 格式日期字符串
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串 YYYY-MM-DD
 */
function getLocalDateStr(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化日期
 * @param {string} dateStr - 日期字符串 YYYY-MM-DD
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dateOnly = dateStr
  const todayStr = getLocalDateStr(today)
  const tomorrowStr = getLocalDateStr(tomorrow)

  if (dateOnly === todayStr) return '今天'
  if (dateOnly === tomorrowStr) return '明天'

  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = weekdays[date.getDay()]

  return `${month}/${day} ${weekday}`
}
