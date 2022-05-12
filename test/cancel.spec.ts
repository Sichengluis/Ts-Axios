import axios from '../src/index'
import { getAjaxRequest } from './jasmineAjaxHelper'

describe('cancel', () => {
  const CancelToken = axios.CancelToken
  const Cancel = axios.Cancel

  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  // 发送请求之前取消请求
  test('should supprot cancel before sending request', () => {
    const source = CancelToken.source()
    source.cancel('Operation has been canceled.')
    return axios
      .get('/foo', {
        cancelToken: source.token,
      })
      .catch((reason) => {
        expect(reason).toEqual(expect.any(Cancel))
        expect(reason.message).toBe('Operation has been canceled.')
      })
  })

  // 发送请求后得到响应前取消请求
  test('should supprot cancel after sending request and before getting response', (done) => {
    const source = CancelToken.source()
    axios
      .get('/foo/bar', {
        cancelToken: source.token,
      })
      .catch((reason) => {
        expect(reason).toEqual(expect.any(Cancel))
        expect(reason.message).toBe('Operation has been canceled.')
        done()
      })
    getAjaxRequest().then((request) => {
      source.cancel('Operation has been canceled.')
      setTimeout(() => {
        request.respondWith({
          status: 200,
          responseText: 'OK',
        })
      }, 100)
    })
  })

  // 接收到响应后在取消请求也不会有异常
  test('should supprot cancel after getting response', (done) => {
    const source = CancelToken.source()
    axios
      .get('/foo', {
        cancelToken: source.token,
      })
      .then((response) => {
        expect(response.data).toBe('OK')
        expect(response.status).toBe(200)
        source.cancel()
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
