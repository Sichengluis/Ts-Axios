/*
 * @Author: Lisc
 * @Date: 2022-04-21 21:16:41
 * @Description: headers模块单元测试
 */
import { AxiosRequestHeaders } from '../../src/types'
import { parseHeaders, setHeaders, flattenHeaders } from '../../src/utils/headers'

describe('utils:headers', () => {
  describe('setHeaders', () => {
    // 将用户设置的content-type请求头的形式转换为Content-Type的标准形式
    test('should normalize Content-Type header name', () => {
      const headers: AxiosRequestHeaders = {
        'coNtenT-Type': 'foo',
        'Content-length': 1024,
      }
      setHeaders(headers, {})
      expect(headers['Content-Type']).toBe('foo')
      expect(headers['coNtenT-Type']).toBeUndefined()
      expect(headers['Content-length']).toBe(1024)
    })

    // 如果data为plainObject，将请求头的Content-Type字段设置为application/json
    test('should set the Content-Type field of header to application/json if data is a plainObject', () => {
      const headers: AxiosRequestHeaders = {
        'Content-length': 1024,
      }
      setHeaders(headers, { a: 1 })
      expect(headers['Content-Type']).toBe('application/json')
    })

    // 如果data不为plainObject，不对用户设置请求头的Content-Type字段设置为application/json
    test('should not change Content-Type field of header if data is not a plainObject', () => {
      // 设置了Content-Type
      const headersContentTypeText: AxiosRequestHeaders = {
        'Content-length': 1024,
        'Content-Type': 'text/plain',
      }
      setHeaders(headersContentTypeText, new FormData())
      expect(headersContentTypeText['Content-Type']).toBe('text/plain')
      // 没有设置Content-Type
      const headersContentTypeUndefined: AxiosRequestHeaders = {
        'Content-length': 1024,
      }
      setHeaders(headersContentTypeUndefined, new URLSearchParams())
      expect(headersContentTypeUndefined['Content-Type']).toBeUndefined()
    })

    // 如果用户将headers设置为null或者undefined，不进行任何操作
    test('should do nothing if headers is undefined or null', () => {
      expect(setHeaders(undefined, {})).toBeUndefined()
      expect(setHeaders(null, {})).toBeNull()
    })
  })

  describe('parseHeaders', () => {
    // 将string形式的响应头转换为对象形式
    test('should transform headers string to object', () => {
      const parsed = parseHeaders(
        'Connection: keep-alive\r\n' +
          'Content-Type: application/json\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
          // key为空或者value为空的情况
          ':aa\r\n' +
          'key:'
      )
      expect(parsed['content-type']).toBe('application/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['key']).toBe('')
    })
    // 响应头为空字符串的话应该返回空对象
    test('should return empty object if header string is empty', () => {
      const parsed = parseHeaders('')
      expect(parsed).toEqual({})
    })
  })

  describe('flattenHeaders', () => {
    // headers中同时包含common和方法时
    test('should flatten headers with common and method specified config', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue',
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue',
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue',
        },
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue',
      })
    })
    // headers不包含common和方法
    test('should faltten headers without common and method configed', () => {
      const headers = {
        Accept: 'application/json',
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
      })
    })
    // headers中包含common
    test('should flatten headers with only common specified', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue',
        },
      }
      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
      })
    })
    // headers中只包含方法
    test('should flatten headers with only method specified', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue',
        },
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-GET-HEADER': 'getHeaderValue',
      })
    })
    // headers中设置的方法和传入的方法不匹配
    test('should flatten headers when method is not matched', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue',
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue',
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue',
        },
      }

      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
      })
    })
    // 用户设置的headers为空的话，不进行flatten操作直接返回
    test('should do nothing if headers is undefined or null', () => {
      expect(flattenHeaders(undefined, 'get')).toBeUndefined()
      expect(flattenHeaders(null, 'post')).toBeNull()
    })
  })
})
