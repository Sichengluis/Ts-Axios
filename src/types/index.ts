/*
 * @Author: Lisc
 * @Date: 2022-03-30 16:05:38
 * @Description:
 */
type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
interface AxiosRequestConfig {
  url?: string
  method?: Method
  params?: any
  data?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number // 请求超时时间
}
interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any //XMLHttpRequest
}
interface AxiosPromise extends Promise<AxiosResponse> {}
interface AxiosError extends Error {
  hasError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any // xhr
  response?: AxiosResponse
}
interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise
  get(url: string, config?: AxiosRequestConfig): AxiosPromise
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise
  head(url: string, config?: AxiosRequestConfig): AxiosPromise
  options(url: string, config?: AxiosRequestConfig): AxiosPromise
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
}
/**
 * @description: 混合对象类型
 * @param {*}
 * @return {*}
 */
interface AxiosInstance extends Axios {
  // 这两个函数其实都指向Axios类的request函数
  (config: AxiosRequestConfig): AxiosPromise
  (url: string, config?: AxiosRequestConfig): AxiosPromise
}
export { Axios, AxiosInstance, Method, AxiosRequestConfig, AxiosResponse, AxiosPromise, AxiosError }
