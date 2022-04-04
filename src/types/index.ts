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

interface AxiosResponse<T = any> {
  data: T // 响应数据支持泛型
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any //XMLHttpRequest
}

// AxiosResponse<T>为resolve(x)中x的数据类型
interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

interface AxiosError extends Error {
  hasError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any // xhr
  response?: AxiosResponse
}

interface Axios {
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

/**
 * @description: 混合对象类型
 * @param {*}
 * @return {*}
 */
interface AxiosInstance extends Axios {
  // 这两个函数其实都指向Axios类的request函数
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export { Axios, AxiosInstance, Method, AxiosRequestConfig, AxiosResponse, AxiosPromise, AxiosError }
