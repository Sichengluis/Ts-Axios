/*
 * @Author: Lisc
 * @Date: 2022-04-03 16:23:38
 * @Description:
 */
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { getUrlWithParams, isAbsoluteURL, combineURL } from '../utils/url'
import { flattenHeaders } from '../utils/headers'
import xhr from './xhr'
import transform from './transform'
/**
 * @description:
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // cancelToken已经被使用过，再去携带相同的cancelToken发送请求没有意义
  throwIfCanceled(config)
  processRequestConfig(config)
  // 返回带有xhr请求结果的Promise对象
  return xhr(config).then(resp => {
    return transformResponseData(resp)
  })
}
function processRequestConfig(config: AxiosRequestConfig): void {
  config.url = processUrl(config)
  config.data = transformRequestData(config)
  config.headers = flattenHeaders(config.headers, config.method!)
}
/**
 * @description: 将params中的参数拼接到url中
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function processUrl(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url!)
  }
  return getUrlWithParams(url!, params, paramsSerializer)
}

/**
 * @description: 根据用户设置的请求数据(请求体data)处理函数,对请求数据进行处理
 * 默认的请求数据处理函数为:如果请求数据为普通对象,将其转换成Json字符串,并设置其Content-Type为application/json
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function transformRequestData(config: AxiosRequestConfig): any {
  return transform(config.data, config.headers, config.transformRequest)
}

/**
 * @description: 根据用户设置的响应数据处理函数,对响应数据进行处理
 * 默认的响应数据处理函数为:如果响应数据为Json字符串,将其转换成Json对象
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function transformResponseData(resp: AxiosResponse): any {
  resp.data = transform(resp.data, resp.headers, resp.config.transformResponse)
  return resp
}

function throwIfCanceled(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
