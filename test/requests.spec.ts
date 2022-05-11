/*
 * @Author: Lisc
 * @Date: 2022-04-28 14:28:31
 * @Description:
 */
import { doesNotMatch } from 'assert'
import axios from '../src/index'
// import axios from 'axios'
import { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './jasmineAjaxHelper'

describe('request', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })
  // 只传入一个string应该被当作url
  test('should treat single string param as request url', () => {
    axios('/foo')
    return getAjaxRequest().then((req) => {
      expect(req.url).toBe('/foo')
      expect(req.method).toBe('get')
    })
  })
  // 传入的method应该被转为小写
  test('should transform method string to losercase', () => {
    axios({
      url: '/foo',
      method: 'POST',
    })
    return getAjaxRequest().then((request) => {
      expect(request.method).toBe('post')
    })
  })
  // 网络异常
  test('should reject on network errors', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    jasmine.Ajax.uninstall()
    // 发起真实的xhr请求
    return axios('http://www.baidu.com/').then(resolveSpy).catch(rejectSpy).then(next)
    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))
      jasmine.Ajax.install()
    }
  })
  // 超时异常
  test('should rejecet when request timeout', (done) => {
    const resolveSpy = jest.fn((resp: AxiosResponse) => {
      return resp
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    axios('/foo', { timeout: 2000, method: 'post' }).then(resolveSpy).catch(rejectSpy).then(next)
    function next(res: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(res instanceof Error).toBeTruthy()
      expect((res as AxiosError).message).toBe('Timeout of 2000 ms exceeded')
      done()
    }
    getAjaxRequest().then((req) => {
      // @ts-ignore
      req.eventBus.trigger('timeout')
    })
  })
  // validateStatus返回false时
  test('should reject when validateStatus returns false', (done) => {
    const resolveSpy = jest.fn((resp: AxiosResponse) => {
      return resp
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    axios('/foo', {
      validateStatus(status) {
        return status != 500
      },
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)
    function next(res: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect((res as AxiosError).message).toBe('Request failed with status code 500')
      expect((res as AxiosError).response!.status).toBe(500)
      done()
    }
    getAjaxRequest().then((req) => {
      req.respondWith({
        status: 500,
      })
    })
  })
  // validateStatus返回true时
  test('should reject when validateStatus returns true', (done) => {
    const resolveSpy = jest.fn((resp: AxiosResponse) => {
      return resp
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    axios('/foo', {
      validateStatus(status) {
        return status >= 200 && status < 300
      },
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)
    function next(res: AxiosResponse | AxiosError) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect((res as AxiosResponse).config.url).toBe('/foo')
      expect((res as AxiosResponse).config.method).toBe('get')
      done()
    }
    getAjaxRequest().then((req) => {
      req.respondWith({
        status: 200,
      })
    })
  })
  // 请求成功时将响应数据转成json
  test('should return JSON when resolved', (done) => {
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: '',
      },
      method: 'post',
      headers: {
        Accept: 'application/json',
      },
    }).then((resp) => {
      const data = resp.data
      expect(data).toEqual({ errno: 0 })
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"errno": 0}',
      })
    })
  })
  // 请求失败时将响应数据转成json
  test('should return JSON when rejected', (done) => {
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: '',
      },
      method: 'post',
      headers: {
        Accept: 'application/json',
      },
    }).catch((e: AxiosError) => {
      const data = e.response!.data
      expect(data).toEqual({ error: 'BAD USERNAME', code: 1 })
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}',
      })
    })
  })
  // 接收到所有响应信息
  test('should receive complete response information', (done) => {
    axios('/foo', {
      method: 'post',
    }).then((resp) => {
      const data = resp.data
      expect(resp.status).toBe(200)
      expect(resp.statusText).toBe('OK')
      expect(resp.headers).toEqual({ 'content-type': 'application/json' })
      expect(data).toEqual({ foo: 'bar' })
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo": "bar"}',
        responseHeaders: {
          'Content-Type': 'application/json',
        },
      })
    })
  })
  // 传入的Content-Type会被Normalize，可以传入任意形式的Content-Type,比如content-type,Content-type
  test('should transform method string to losercase', (done) => {
    axios({
      url: '/foo',
      method: 'POST',
      data: { prop: 'value' },
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => {
      const requestHeaders = response.config!.headers!
      expect(requestHeaders['Content-Type']).toBe('application/json')
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
      })
    })
  })
  // 能够使用ArrayBuffer作为响应
  test('should support array buffer response', (done) => {
    function str2ab(str: string) {
      const buff = new ArrayBuffer(str.length)
      const view = new Uint8Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }
    axios('/foo', {
      responseType: 'arraybuffer',
    }).then((response: AxiosResponse) => {
      expect(response.data instanceof ArrayBuffer)
      expect(response.data.byteLength).toBe(11)
      done()
    })
    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        // @ts-ignore
        response: str2ab('Hello world'),
      })
    })
  })
})
