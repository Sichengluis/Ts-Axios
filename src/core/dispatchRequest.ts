/*
 * @Author: Lisc
 * @Date: 2022-04-03 16:23:38
 * @Description:
 */
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { transformRequestData, transformResponseData } from '../utils/data'
import getUrlWithParams from '../utils/url'
import { setHeaders } from '../utils/headers'
import xhr from './xhr'
/**
 * @description:
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processRequestConfig(config)
  // 返回带有xhr请求结果的Promise对象
  return xhr(config).then(res => {
    return processResponseData(res)
  })
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
  return getUrlWithParams(url!, params)
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
/**
 * @description: 转换响应数据格式(如果响应数据为Json字符串,将其转换成Json对象)
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function processResponseData(resp: AxiosResponse): any {
  resp.data = transformResponseData(resp.data)
  return resp
}
