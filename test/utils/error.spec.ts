/*
 * @Author: Lisc
 * @Date: 2022-04-21 20:51:30
 * @Description: error模块单元测试
 */
import { AxiosError, createError } from '../../src/utils/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('utils:error', () => {
  // 测试AxiosError对象的各个属性值
  test('should create an Error with message,config,code,request,response and isAxiosError', () => {
    const config: AxiosRequestConfig = { method: 'post' }
    const request = new XMLHttpRequest()
    const resp: AxiosResponse = {
      status: 400,
      statusText: 'bad request',
      headers: { 'access-control-allow-credentials': true },
      request,
      config,
      data: { foo: 'bar' },
    }
    const error = createError('network error', config, '400', request, resp)
    expect(error instanceof Error).toBeTruthy()
    expect(error instanceof AxiosError).toBeTruthy()
    expect(error.message).toBe('network error')
    expect(error.config).toBe(config)
    expect(error.code).toBe('400')
    expect(error.request).toBe(request)
    expect(error.response).toBe(resp)
    expect(error.isAxiosError).toBeTruthy()
  })
})
