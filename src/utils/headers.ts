/*
 * @Author: Lisc
 * @Date: 2022-03-31 10:39:00
 * @Description: 处理请求头
 */

import plainObjectOrNot from './object'

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
  Object.keys(headers).forEach(headerName => {
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
 * @description: xhr 中数据为Json字符串的话,默认设置请求头的Content-Type为text/plain，
 * 这里需要将其修改成application/json
 * @param {any} headers
 * @param {any} data
 * @return {*}
 */
function setHeaders(headers: any, data: any): void {
  const contentTypeStr = 'Content-Type'
  const jsonContentType = 'application/json'
  normalizeHeaderName(headers, contentTypeStr)
  if (plainObjectOrNot(data)) {
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
  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(':')
    if (!key) {
      return
    }
    key = key.trim().toLocaleLowerCase()
    if (value) {
      value.trim()
    }
    parsedHeaders[key] = value
  })
  return parsedHeaders
}

export { setHeaders, parseHeaders }
