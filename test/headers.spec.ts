import axios from '../src'
import { getAjaxRequest } from './jasmineAjaxHelper'

describe('headers', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  // 没有配置headers时，默认使用common中的配置
  test('common headers should be used when headers are not configed', () => {
    const commonHeaders = axios.defaults.headers.common
    axios('/foo')
    return getAjaxRequest().then((request) => {
      for (let key in commonHeaders) {
        if (commonHeaders.hasOwnProperty(key)) {
          expect(request.requestHeaders[key]).toEqual(commonHeaders[key])
        }
      }
    })
  })

  // 为包含数据的post请求添加content-type请求头
  test('should add additional headers for post requests', () => {
    axios.post('/foo', 'fizz=buzz')
    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders['Content-Type']).toBe('application/x-www-form-urlencoded')
    })
  })

  //请求数据为对象时，content-type设置为application/json
  test('should use application/json when posting an object', () => {
    axios.post('/foo/bar', {
      firstName: 'foo',
      lastName: 'bar',
    })
    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json')
    })
  })

  // post请求没有请求数据的话，不应该自动设置Content-Type请求头
  test('content-type should be undefined if the request data is empty', () => {
    axios.post('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders['Content-Type']).toBe(undefined)
    })
  })

  // post请求数据是false的话，应该自动设置Content-Type请求头
  test('content-type should NOT be undefined if the request data is false itself', () => {
    axios.post('/foo', false)
    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders['Content-Type']).toBe('application/x-www-form-urlencoded')
    })
  })

  //post请求数据类型为FormData的话，不应该自动设置Content-Type，使用xhr自动将Content-Type设置为multipart/form-data并添加boundary
  test('content-type should be undefined if the type of request data is FormData', () => {
    const data = new FormData()
    data.append('foo', 'bar')
    axios.post('/foo', data)
    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders['Content-Type']).toBe(undefined)
    })
  })
})
