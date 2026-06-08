/**
 * @fileoverview 天气 API 单元测试
 * @description 测试 weather.js 中的核心函数
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { searchCity, getWeather, ErrorType, ApiError } from './weather.js'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn()
    }))
  }
}))

describe('searchCity', () => {
  it('应该对空字符串返回空数组', async () => {
    const result = await searchCity('')
    expect(result).toEqual([])
  })

  it('应该对 null 返回空数组', async () => {
    const result = await searchCity(null)
    expect(result).toEqual([])
  })

  it('应该对纯空格返回空数组', async () => {
    const result = await searchCity('   ')
    expect(result).toEqual([])
  })
})

describe('ApiError', () => {
  it('应该正确创建错误实例', () => {
    const error = new ApiError('测试错误', ErrorType.NETWORK)

    expect(error.message).toBe('测试错误')
    expect(error.type).toBe(ErrorType.NETWORK)
    expect(error.name).toBe('ApiError')
    expect(error.timestamp).toBeDefined()
  })

  it('应该保存原始错误', () => {
    const originalError = new Error('原始错误')
    const error = new ApiError('包装错误', ErrorType.API, originalError)

    expect(error.originalError).toBe(originalError)
  })
})

describe('ErrorType', () => {
  it('应该包含所有错误类型', () => {
    expect(ErrorType.NETWORK).toBe('NETWORK_ERROR')
    expect(ErrorType.TIMEOUT).toBe('TIMEOUT_ERROR')
    expect(ErrorType.API).toBe('API_ERROR')
    expect(ErrorType.PARSE).toBe('PARSE_ERROR')
    expect(ErrorType.UNKNOWN).toBe('UNKNOWN_ERROR')
  })
})
