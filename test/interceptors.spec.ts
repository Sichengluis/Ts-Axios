import { doesNotMatch } from 'assert'
import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './jasmineAjaxHelper'

describe('interceptors', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  // 请求拦截器
  test('should support request interceptors', () => {
    const instance = axios.create()
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      config.headers!.test = 'added by interceptor'
      return config
    })
    instance('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders.test).toBe('added by interceptor')
    })
  })

  // 请求拦截器返回config对象
  test('request interceptor could return a new config object', () => {
    const instance = axios.create()
    instance.interceptors.request.use(() => {
      return {
        url: '/bar',
        method: 'post',
      }
    })
    instance('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.method).toBe('post')
      expect(request.url).toBe('/bar')
    })
  })

  // 请求拦截器返回Promise
  test('request interceptor could return a promise', (done) => {
    const instance = axios.create()
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          config.headers!.async = 'promise'
          resolve(config)
        }, 10)
      })
    })
    instance('/foo')
    // 定时器保证其中代码在异步拦截器执行完毕后才执行
    // getAjaxRequest().then((request) => {
    //   setTimeout(() => {
    //     expect(request.requestHeaders.async).toBe('promise')
    //     done()
    //   }, 100)
    // })
    setTimeout(() => {
      getAjaxRequest().then((request) => {
        expect(request.requestHeaders.async).toBe('promise')
        done()
      })
    }, 100)
  })

  // 多个请求拦截器
  test('should support multiple request interceptors', () => {
    const instance = axios.create()
    instance.interceptors.request.use((config) => {
      config.headers!.test1 = '1'
      return config
    })
    instance.interceptors.request.use((config) => {
      config.headers!.test2 = '2'
      return config
    })
    instance.interceptors.request.use((config) => {
      config.headers!.test3 = '3'
      return config
    })
    instance('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders.test1).toBe('1')
      expect(request.requestHeaders.test2).toBe('2')
      expect(request.requestHeaders.test3).toBe('3')
    })
  })

  // 响应拦截器
  test('should support response interceptors', (done) => {
    const instance = axios.create()
    instance.interceptors.response.use((response) => {
      response.data = response.data + ' - modified by interceptor'
      return response
    })
    instance('/foo').then((response) => {
      expect(response.data).toBe('OK - modified by interceptor')
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        responseText: 'OK',
      })
    })
  })

  // 响应拦截器应该返回新的data对象
  test('response interceptor could retuen a new data object', (done) => {
    const instance = axios.create()
    instance.interceptors.response.use(() => {
      return {
        data: 'stuff',
        headers: {
          Connection: 'Keep-Alive',
        },
        status: 500,
        statusText: 'ERR',
        request: null,
        config: {},
      }
    })
    instance('/foo').then((response) => {
      expect(response.data).toBe('stuff')
      expect(response.headers).toEqual({
        Connection: 'Keep-Alive',
      })
      expect(response.status).toBe(500)
      expect(response.statusText).toBe('ERR')
      expect(response.request).toBeNull()
      expect(response.config).toEqual({})
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        responseText: 'OK',
      })
    })
  })

  // 响应拦截器返回promise
  test('response interceptor could return a promise', (done) => {
    const instance = axios.create()
    // 异步响应拦截器
    instance.interceptors.response.use((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          response.data = 'you have been promised!'
          resolve(response)
        }, 10)
      })
    })

    instance('/foo').then((response) => {
      setTimeout(() => {
        expect(response.data).toBe('you have been promised!')
        done()
      }, 100)
    })

    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        responseText: 'OK',
      })
    })
  })

  // 多个响应拦截器
  test('should add multiple response interceptors', (done) => {
    const instance = axios.create()
    instance.interceptors.response.use((resp) => {
      resp.data = resp.data + '1'
      return resp
    })
    instance.interceptors.response.use((resp) => {
      resp.data = resp.data + '2'
      return resp
    })
    instance.interceptors.response.use((resp) => {
      resp.data = resp.data + '3'
      return resp
    })
    instance('/foo').then((response) => {
      expect(response.data).toBe('OK123')
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        responseText: 'OK',
      })
    })
  })

  // 删除拦截器
  test('should allow removing interceptors', (done) => {
    const instance = axios.create()
    instance.interceptors.response.use((data) => {
      data.data = data.data + '1'
      return data
    })
    let intercept = instance.interceptors.response.use((data) => {
      data.data = data.data + '2'
      return data
    })
    instance.interceptors.response.use((data) => {
      data.data = data.data + '3'
      return data
    })
    instance.interceptors.response.eject(intercept)
    instance.interceptors.response.eject(0)
    instance('/foo').then((response) => {
      expect(response.data).toBe('OK3')
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        responseText: 'OK',
      })
    })
  })
})
