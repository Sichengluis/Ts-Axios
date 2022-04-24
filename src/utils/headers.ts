/*
 * @Author: Lisc
 * @Date: 2022-03-31 10:39:00
 * @Description: 处理请求头和响应头
 */

import { Method } from '../types'
import { deepCopy, isPlainObject } from './helpers'

/**
 * @description: 将用户传入的请求头中的key转换成标准格式
 * 例如 content-type 会被转换成 Content-Type
 * @param {any} headers
 * @param {string} normalizedHeaderName
 * @return {*}
 */
function normalizeHeaderName(headers: any, normalizedHeaderName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach((headerName) => {
    if (
      headerName.toUpperCase() === normalizedHeaderName.toUpperCase() &&
      headerName !== normalizedHeaderName
    ) {
      headers[normalizedHeaderName] = headers[headerName]
      delete headers[headerName]
    }
  })
}

/**
 * @description: xhr 中的data数据不接受对象形式，需要转为Json字符串
 * 而Json字符串会被当做普通文本处理，xhr默认设置的请求头为Content-Type为text/plain，
 * 这里需要将其修改成application/json
 * @param {any} headers
 * @param {any} data
 * @return {*}
 */
function setHeaders(headers: any, data: any): void {
  const contentTypeStr = 'Content-Type'
  const jsonContentType = 'application/json'
  normalizeHeaderName(headers, contentTypeStr)
  if (isPlainObject(data)) {
    if (headers && !headers[contentTypeStr]) {
      headers[contentTypeStr] = jsonContentType
    }
  }
  return headers
}

/**
 * @description: 将字符串类型的响应头转成对象形式
 * @param {string} headers
 * @return {*}
 */
function parseHeaders(headers: string): any {
  const parsedHeaders: any = Object.create(null)
  if (!headers) {
    return parsedHeaders
  }
  headers.split('\r\n').forEach((line) => {
    let [key, ...valuesArr] = line.split(':')
    if (!key) {
      return
    }
    key = key.trim().toLocaleLowerCase()
    const value = valuesArr.join(':').trim()
    parsedHeaders[key] = value
  })
  return parsedHeaders
}

function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  // 顺序不可颠倒,后边的优先级高
  const methodMergedHeaders = deepCopy(headers.common, headers[method])
  const keysToDelete: string[] = [
    'common',
    'get',
    'delete',
    'head',
    'options',
    'post',
    'put',
    'patch',
  ]
  keysToDelete.forEach((key) => {
    delete headers[key]
  })
  return deepCopy(methodMergedHeaders, headers)
}

export { setHeaders, parseHeaders, flattenHeaders }
