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
export { Method, AxiosRequestConfig, AxiosResponse, AxiosPromise }
