/**
 * @fileoverview 天气工具函数单元测试
 * @description 测试 weatherCode.js 中的核心函数
 */

import { describe, it, expect } from 'vitest'
import {
  getWeatherInfo,
  getWindDirection,
  getWindLevel,
  formatDate
} from './weatherCode.js'

// ============================================================================
// getWeatherInfo 测试
// ============================================================================

describe('getWeatherInfo', () => {
  it('应该返回晴天信息 (code: 0)', () => {
    const result = getWeatherInfo(0)
    expect(result.text).toBe('晴天')
    expect(result.emoji).toBe('☀️')
  })

  it('应该返回多云信息 (code: 2)', () => {
    const result = getWeatherInfo(2)
    expect(result.text).toBe('多云')
    expect(result.emoji).toBe('⛅')
  })

  it('应该返回小雨信息 (code: 61)', () => {
    const result = getWeatherInfo(61)
    expect(result.text).toBe('小雨')
    expect(result.emoji).toBe('🌧️')
  })

  it('应该返回雷暴信息 (code: 95)', () => {
    const result = getWeatherInfo(95)
    expect(result.text).toBe('雷暴')
    expect(result.emoji).toBe('⛈️')
  })

  it('应该对未知代码返回默认值', () => {
    const result = getWeatherInfo(999)
    expect(result.text).toBe('未知')
    expect(result.emoji).toBe('❓')
  })

  it('应该对 null 返回默认值', () => {
    const result = getWeatherInfo(null)
    expect(result.text).toBe('未知')
  })

  it('应该对 undefined 返回默认值', () => {
    const result = getWeatherInfo(undefined)
    expect(result.text).toBe('未知')
  })
})

// ============================================================================
// getWindDirection 测试
// ============================================================================

describe('getWindDirection', () => {
  it('应该返回北风 (0度)', () => {
    expect(getWindDirection(0)).toBe('北风')
  })

  it('应该返回北风 (360度)', () => {
    expect(getWindDirection(360)).toBe('北风')
  })

  it('应该返回东北风 (45度)', () => {
    expect(getWindDirection(45)).toBe('东北风')
  })

  it('应该返回东风 (90度)', () => {
    expect(getWindDirection(90)).toBe('东风')
  })

  it('应该返回东南风 (135度)', () => {
    expect(getWindDirection(135)).toBe('东南风')
  })

  it('应该返回南风 (180度)', () => {
    expect(getWindDirection(180)).toBe('南风')
  })

  it('应该返回西南风 (225度)', () => {
    expect(getWindDirection(225)).toBe('西南风')
  })

  it('应该返回西风 (270度)', () => {
    expect(getWindDirection(270)).toBe('西风')
  })

  it('应该返回西北风 (315度)', () => {
    expect(getWindDirection(315)).toBe('西北风')
  })

  it('应该对 null 返回无风', () => {
    expect(getWindDirection(null)).toBe('无风')
  })

  it('应该对 undefined 返回无风', () => {
    expect(getWindDirection(undefined)).toBe('无风')
  })
})

// ============================================================================
// getWindLevel 测试
// ============================================================================

describe('getWindLevel', () => {
  it('应该返回无风 (0 km/h)', () => {
    expect(getWindLevel(0)).toBe('无风')
  })

  it('应该返回1级 (3 km/h)', () => {
    expect(getWindLevel(3)).toBe('1级')
  })

  it('应该返回2级 (8 km/h)', () => {
    expect(getWindLevel(8)).toBe('2级')
  })

  it('应该返回3级 (15 km/h)', () => {
    expect(getWindLevel(15)).toBe('3级')
  })

  it('应该返回5级 (35 km/h)', () => {
    expect(getWindLevel(35)).toBe('5级')
  })

  it('应该返回8级 (70 km/h)', () => {
    expect(getWindLevel(70)).toBe('8级')
  })

  it('应该返回12级以上 (120 km/h)', () => {
    expect(getWindLevel(120)).toBe('12级以上')
  })
})

// ============================================================================
// formatDate 测试
// ============================================================================

describe('formatDate', () => {
  function toLocalDateStr(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  it('应该返回今天', () => {
    const today = toLocalDateStr(new Date())
    expect(formatDate(today)).toBe('今天')
  })

  it('应该返回明天', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = toLocalDateStr(tomorrow)
    expect(formatDate(tomorrowStr)).toBe('明天')
  })

  it('应该返回格式化的日期和星期', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 5)
    const result = formatDate(toLocalDateStr(futureDate))

    expect(result).toMatch(/\d+\/\d+\s周[一二三四五六日]/)
  })
})
