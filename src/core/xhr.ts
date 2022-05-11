/*
 * @Author: Lisc
 * @Date: 2022-03-30 16:36:33
 * @Description: 发送xhr请求
 */
import { createError } from '../utils/error'
import { parseHeaders } from '../utils/headers'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { isURLSameOrigin } from '../utils/url'
import { isFormData } from '../utils/helpers'
import cookie from '../utils/cookie'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus,
      method = 'get',
      headers = {},
      data = null,
    } = config
    const xhr = new XMLHttpRequest()

    // xhr.open(method.toUpperCase(), url!, true)
    xhr.open(method, url!, true)

    configXhr()

    addEvents()

    xhr.send(data)

    /**
     * @description: 处理xhr的headers
     * @param {*}
     * @return {*}
     */
    function processHeaders(): void {
      if (isFormData(data)) {
        // defaults中将含有data请求的Content-Type全部设置为了application/x-www-form-urlencoded
        // 如果请求数据类型为FormData，需要删除我们默认设置的默认值，让浏览器根据请求数据自动设置为form-data，
        // 即multipart/form-data; boundary=----WebKitFormBoundaryfMam9AjKqWXMBjBF
        delete headers['Content-Type']
      }

      // XSRF 防御
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfToken = cookie.getCookie(xsrfCookieName)
        if (xsrfToken && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfToken
        }
      }

      if (auth) {
        headers['Authorization'] = `Basic ${btoa(`${auth.username}:${auth.password}`)}`
      }

      // 给xhr设置请求头
      Object.keys(headers).forEach((headerName) => {
        if (headerName.toLowerCase() === 'content-type' && data === null) {
          delete headers[headerName]
          return
        }
        xhr.setRequestHeader(headerName, headers[headerName] as string)
      })
    }

    /**
     * @description: 处理xhr的cancelToken配置
     * @param {*}
     * @return {*}
     */
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then((reason) => {
          xhr.abort()
          reject(reason)
        })
      }
    }

    /**
     * @description: 配置xhr，设置xhr的各个属性
     * @param {*}
     * @return {*}
     */
    function configXhr(): void {
      if (responseType) {
        xhr.responseType = responseType
      }

      if (timeout) {
        xhr.timeout = timeout
      }

      if (withCredentials) {
        xhr.withCredentials = withCredentials
      }

      processHeaders()

      processCancel()
    }

    /**
     * @description: 为xhr设置监听事件
     * @param {*}
     * @return {*}
     */
    function addEvents(): void {
      if (onDownloadProgress) {
        xhr.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        xhr.upload.onprogress = onUploadProgress
      }

      xhr.onreadystatechange = function () {
        if (xhr.status === 0) {
          return
        }
        if (xhr.readyState !== 4) {
          return
        }
        // 成功获取响应
        const responseHeaders = parseHeaders(xhr.getAllResponseHeaders())
        const responseData =
          responseType && responseType !== 'text' ? xhr.response : xhr.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: responseHeaders,
          config,
          request: xhr,
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
    }

    /**
     * @description: 根据Http状态码处理响应数据
     * @param {AxiosResponse} res
     * @return {*}
     */
    function handleResponseStatus(resp: AxiosResponse): void {
      if (!validateStatus || validateStatus(resp.status)) {
        resolve(resp)
      } else {
        reject(
          createError(`Request failed with status code ${resp.status}`, config, null, xhr, resp)
        )
      }
    }
  })
}
