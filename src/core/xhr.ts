/*
 * @Author: Lisc
 * @Date: 2022-03-30 16:36:33
 * @Description: 发送xhr请求
 */
import { createError } from '../utils/error'
import { transformResponse } from '../utils/data'
import { parseHeaders } from '../utils/headers'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      method = 'get',
      data = null
    } = config
    const xhr = new XMLHttpRequest()
    if (responseType) {
      xhr.responseType = responseType
    }

    xhr.open(method.toUpperCase(), url!, true)

    if (headers) {
      Object.keys(headers).forEach(headerName => {
        if (headerName.toLowerCase() === 'content-type' && data === null) {
          delete headers[headerName]
          return
        }
        xhr.setRequestHeader(headerName, headers[headerName] as string)
      })
    }
    if (timeout) {
      xhr.timeout = timeout
    }

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        xhr.abort()
        reject(reason)
      })
    }

    if (withCredentials) {
      xhr.withCredentials = withCredentials
    }

    xhr.send(data)

    xhr.onreadystatechange = function() {
      if (xhr.status === 0) {
        return
      }
      if (xhr.readyState !== 4) {
        return
      }
      // 成功获取响应
      const responseHeaders = parseHeaders(xhr.getAllResponseHeaders())
      const responseData = xhr.response
      const response: AxiosResponse = {
        data: responseData,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        config,
        request: xhr
      }
      handleResponseStatus(response)
    }

    // 网络异常错误处理
    xhr.addEventListener('error', () => {
      reject(createError('Network Error', config, null, xhr))
    })

    // 超时异常处理
    xhr.addEventListener('timeout', () => {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', xhr))
    })

    /**
     * @description: 根据Http状态码处理响应数据
     * @param {AxiosResponse} res
     * @return {*}
     */
    function handleResponseStatus(resp: AxiosResponse): void {
      if ((resp.status >= 200 && resp.status < 300) || resp.status === 304) {
        resolve(resp)
      } else {
        reject(
          createError(`Request failed with stauts code ${resp.status}`, config, null, xhr, resp)
        )
      }
    }
  })
}
