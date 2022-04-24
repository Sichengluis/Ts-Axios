/*
 * @Author: Lisc
 * @Date: 2022-04-21 20:11:06
 * @Description: data模块单元测试
 */
import { transformRequest, transformResponse } from '../../src/utils/data'

describe('utils:data', () => {
  describe('transformRequest', () => {
    // 将plainObject形式的data转换为Json string
    test('should transform plainObject to json string', () => {
      const a = { b: 2 }
      expect(transformRequest(a)).toBe('{"b":2}')
    })
    // 如果data不是plainObject，不进行任何操作
    test('should do nothing if para is not a plainObject', () => {
      let str = '{"a":1}'
      expect(transformRequest(str)).toBe('{"a":1}')
      let usp = new URLSearchParams('a=b')
      expect(transformRequest(usp)).toBe(usp)
      const n = null
      expect(transformRequest(n)).toBeNull()
      const u = undefined
      expect(transformRequest(u)).toBeUndefined()
    })
  })
  describe('transformResponse', () => {
    // 将响应体数据从Json string转为Json object
    test('should transform json string to json object', () => {
      const a = '{"b": 2}'
      expect(transformResponse(a)).toEqual({ b: 2 })
    })
    // 如果响应体数据不是Json string ，不进行任何操作
    test('should do nothing if para is not json string', () => {
      const a = '{b: 2}'
      expect(transformResponse(a)).toBe('{b: 2}')
      // Json字符串，属性名必须用双引号包裹
      const b = "{'d':4}"
      expect(transformResponse(b)).toBe("{'d':4}")
      const c = { d: 4 }
      expect(transformResponse(c)).toBe(c)
      const n = null
      expect(transformResponse(n)).toBeNull()
      const u = undefined
      expect(transformResponse(u)).toBeUndefined()
    })
  })
})
