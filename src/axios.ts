/*
 * @Author: Lisc
 * @Date: 2022-03-30 15:48:07
 * @Description:
 */

import { AxiosRequestConfig, AxiosPromise } from './types'
import { transformRequestData } from './utils/data'
import getUrlWithParams from './utils/url'
import { setHeaders } from './utils/headers'
import xhr from './xhr'
/**
 * @description:
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
export default function axios(config: AxiosRequestConfig): AxiosPromise {
  processRequestConfig(config)
  // 返回带有xhr请求结果的Promise对象
  return xhr(config)
}
function processRequestConfig(config: AxiosRequestConfig): void {
  config.url = processUrl(config)
  config.headers = processHeaders(config)
  config.data = processRequestData(config)
}
/**
 * @description: 将params中的参数拼接到url中
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function processUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return getUrlWithParams(url, params)
}
/**
 * @description: 将对象形式的data转换成Json字符串
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function processRequestData(config: AxiosRequestConfig): any {
  return transformRequestData(config.data)
}
/**
 * @description: data若为普通对象，设置请求头Content-Type为application/json
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function processHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return setHeaders(headers, data)
}
