/*
 * @Author: Lisc
 * @Date: 2022-03-30 15:48:07
 * @Description: 入口文件
 */

import { AxiosRequestConfig } from './types'
import getUrlWithParams from './utils/url'
import xhr from './xhr'
/**
 * @description:
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
export default function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}
function processConfig(config: AxiosRequestConfig): void {
  config.url = processUrl(config)
}
function processUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return getUrlWithParams(url, params)
}
