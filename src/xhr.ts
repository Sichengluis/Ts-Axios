/*
 * @Author: Lisc
 * @Date: 2022-03-30 16:36:33
 * @Description: 发送xhr请求
 */

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { url, headers, responseType, method = 'get', data = null } = config
    const xhr = new XMLHttpRequest()
    if (responseType) {
      xhr.responseType = responseType
    }
    xhr.open(method.toUpperCase(), url, true)
    if (headers) {
      Object.keys(headers).forEach(headerName => {
        if (headerName.toLowerCase() === 'content-type' && data === null) {
          delete headers[headerName]
          return
        }
        xhr.setRequestHeader(headerName, headers[headerName])
      })
    }
    xhr.send(data)
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        const responseHeaders = xhr.getAllResponseHeaders()
        const responseData = xhr.response
        const promiseResolvedResponse: AxiosResponse = {
          data: responseData,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: responseHeaders,
          config,
          request: xhr
        }
        resolve(promiseResolvedResponse)
      }
    }
  })
}
