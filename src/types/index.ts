/*
 * @Author: Lisc
 * @Date: 2022-03-30 16:05:38
 * @Description: 封装请求对象
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
  url: string
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
export { Method, AxiosRequestConfig, AxiosResponse, AxiosPromise, AxiosError }
