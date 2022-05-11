import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './jasmineAjaxHelper'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  // 支持以函数形式直接调用
  test('should support for calling as a function', () => {
    const instance = axios.create()
    instance('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.url).toBe('/foo')
    })
  })

  // 支持以get请求别名形式调用
  test('should support for calling as a get request alias', () => {
    const instance = axios.create()
    instance.get('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('get')
    })
  })

  // 支持以post请求别名形式调用
  test('should support for calling as a post request alias', () => {
    const instance = axios.create()
    instance.post('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.method).toBe('post')
    })
  })

  // 支持以put请求别名形式调用
  test('should support for calling as a put request alias', () => {
    const instance = axios.create()
    instance.put('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.method).toBe('put')
    })
  })

  // 支持以patch请求别名形式调用
  test('should support for calling as a patch request alias', () => {
    const instance = axios.create()
    instance.patch('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.method).toBe('patch')
    })
  })

  // 支持以options请求别名形式调用
  test('should support for calling as a options request alias', () => {
    const instance = axios.create()
    instance.options('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.method).toBe('options')
    })
  })

  // 支持以delete请求别名形式调用
  test('should support for calling as a delete request alias', () => {
    const instance = axios.create()
    instance.delete('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.method).toBe('delete')
    })
  })

  // 支持以head请求别名形式调用
  test('should support for calling as a head request alias', () => {
    const instance = axios.create()
    instance.head('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.method).toBe('head')
    })
  })

  // instance实例同样支持传入配置对象
  test('should support instance options', () => {
    const instance = axios.create({ timeout: 1000 })
    instance.get('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.timeout).toBe(1000)
    })
  })

  // instance实例同样有默认的headers配置
  test('should have defaults.headers', () => {
    const instance = axios.create()
    instance.get('/foo')
    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders).toEqual({ Accept: 'application/json,text/plain,*/*' })
    })
  })

  // instance 同样支持拦截器，并且不受axios本身拦截器的影响
  test('should support interceptors on the instance', (done) => {
    axios.interceptors.request.use((config) => {
      config.timeout = 2000
      return config
    })
    const instance = axios.create()
    instance.interceptors.request.use((config) => {
      config.withCredentials = true
      return config
    })
    instance.get('/foo').then((response) => {
      expect(response.config.timeout).toBe(0)
      expect(response.config.withCredentials).toBeTruthy()
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
      })
    })
  })

  test('should support uri computing', () => {
    const fakeConfig: AxiosRequestConfig = {
      baseURL: 'https://www.baidu.com/',
      url: '/user/12345',
      params: {
        idClient: 1,
        idTest: 2,
        testString: 'thisIsATest',
      },
    }
    expect(axios.getUri(fakeConfig)).toBe(
      'https://www.baidu.com/user/12345?idClient=1&idTest=2&testString=thisIsATest'
    )
  })
})
