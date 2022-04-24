/*
 * @Author: Lisc
 * @Date: 2022-03-30 20:59:08
 * @Description: 处理请求url路径
 */
import { isPlainObject } from './helpers'
import { isDate } from './helpers'
import { isURLSearchParams } from './helpers'

interface URLOrigin {
  protocol: string
  host: string
}

/**
 * @description: 用于将一个对象通过 URL 进行传输
 * encodeURIComponent方法将特殊字符比如空格进行编码，
 * 不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码
 * @param {string} preVal
 * @return {string}
 */
function encode(preVal: string): string {
  return encodeURIComponent(preVal)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * @description: 拼接得到get请求的url
 * @param {string} url
 * @param {any} params
 * @return {*}
 */
function getUrlWithParams(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parafragments: string[] = []
    // params实际上是一个对象
    Object.keys(params).forEach((key) => {
      const val = params[key]
      // 参数值传了一个空值
      if (!val) {
        return
      }
      // 将每个参数值转成数组方便进行统一处理
      let valArr: string[] = []
      if (Array.isArray(val)) {
        valArr = val
        key += '[]'
      } else {
        valArr = [val]
      }
      valArr.forEach((val) => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        // 只有参数值为数组时会push多次
        parafragments.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parafragments.join('&')
  }
  // 去除url的锚点
  let index: number = url.indexOf('#')
  if (index !== -1) {
    url = url.slice(0, index)
  }
  // 将url和查询字符串拼接
  if (serializedParams.length) {
    url = url + (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

function isURLSameOrigin(url: string): boolean {
  const parsedOrigin = resolveURL(url)
  return (
    // host为主机和端口，hostname只有主机
    parsedOrigin.protocol === window.location.protocol && parsedOrigin.host === window.location.host
  )
}

function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

function combineURL(baseURL: string, relativeURL: string): string {
  // 自动删除baseURL后边和relativeURL前边的一个或多个/
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

const urlParsingNode = document.createElement('a')

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host,
  }
}

export { getUrlWithParams, isURLSameOrigin, isAbsoluteURL, combineURL }
