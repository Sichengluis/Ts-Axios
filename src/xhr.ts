/*
 * @Author: Lisc
 * @Date: 2022-03-30 16:36:33
 * @Description: 发送xhr请求
 */

import { AxiosRequestConfig } from './types'
export default function xhr(config: AxiosRequestConfig): void {
  const { url, method = 'get', data = null } = config
  const xhr = new XMLHttpRequest()
  xhr.open(method.toUpperCase(), url, true)
  xhr.send(data)
}
