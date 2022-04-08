/*
 * @Author: Lisc
 * @Date: 2022-04-06 14:16:28
 * @Description: Axios配置化的实现
 */

import { AxiosDefaultRequestConfig, AxiosRequestHeaders } from './types'
import { transformRequest, transformResponse } from './utils/data'
import { setHeaders } from './utils/headers'

//请求的默认配置
const defaults: AxiosDefaultRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json,text/plain,*/*'
    }
  },
  transformRequest: [
    function(data: any, headers: AxiosRequestHeaders): any {
      setHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
}

const methodsWithData = ['post', 'put', 'patch']
const methodsWithoutData = ['get', 'delete', 'head', 'options']
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
methodsWithoutData.forEach(method => {
  defaults.headers[method] = {}
})

export default defaults
