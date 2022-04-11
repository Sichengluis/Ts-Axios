/*
 * @Author: Lisc
 * @Date: 2022-03-30 16:05:38
 * @Description: 公用和暴露给使用者的接口
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

type AxiosRequestHeaders = Record<string, string | number | boolean>

type AxiosResponseHeaders = Record<string, string> & {
  'set-cookie'?: string[]
}

interface HeadersDefaults {
  common?: AxiosRequestHeaders
  delete?: AxiosRequestHeaders
  get?: AxiosRequestHeaders
  head?: AxiosRequestHeaders
  post?: AxiosRequestHeaders
  put?: AxiosRequestHeaders
  patch?: AxiosRequestHeaders
  options?: AxiosRequestHeaders
  purge?: AxiosRequestHeaders
  link?: AxiosRequestHeaders
  unlink?: AxiosRequestHeaders
  // 为了跳过Ts静态类型检查添加的属性
  [propName: string]: any
}

interface TransformFn {
  (data: any, headers?: any): any
}

interface AxiosRequestConfig {
  url?: string
  method?: Method
  params?: any
  data?: any
  headers?: AxiosRequestHeaders
  responseType?: XMLHttpRequestResponseType
  timeout?: number // 请求超时时间
  transformRequest?: TransformFn | TransformFn[]
  transformResponse?: TransformFn | TransformFn[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  // 为了跳过Ts静态类型检查添加的属性
  [propName: string]: any
}

/**
 * @description: Axios默认请求配置对象
 * 除了headers类型外,其他类型与请求配置对象相同
 */
interface AxiosDefaultRequestConfig extends Omit<AxiosRequestConfig, 'headers'> {
  headers: HeadersDefaults
}

interface AxiosResponse<T = any> {
  data: T // 响应数据支持泛型
  status: number
  statusText: string
  headers: AxiosResponseHeaders
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
  defaults: AxiosDefaultRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
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

/**
 * @description: Axios 类类型接口
 * 描述Axios的静态属性和方法
 */
interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (val: any) => boolean
}

interface AxiosInterceptorManager<T> {
  use(resolve: ResolvedFn<T>, reject?: RejectedFn): number
  eject(id: number): void
}

interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

interface RejectedFn {
  (error: any): any
}

/**
 * @description: 实例类型接口
 */
interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  throwIfRequested(): void
}

interface CancelTokenSource {
  token: CancelToken
  cancel: CancelFn
}

/**
 * @description: 类类型接口
 */
interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

/**
 * @description: 取消方法cancel的类型
 */
interface CancelFn {
  (message?: string): void
}

/**
 * @description: 一个函数，为CancelToken构造函数的参数
 * 此函数的参数也为函数，即取消函数
 */
interface CancelExecutor {
  (cancel: CancelFn): void
}

interface Cancel {
  message?: string
}

interface CancelStatic {
  new (message?: string): Cancel
}

export {
  Axios,
  AxiosInstance,
  Method,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosPromise,
  AxiosError,
  AxiosInterceptorManager,
  ResolvedFn,
  RejectedFn,
  TransformFn,
  AxiosDefaultRequestConfig,
  HeadersDefaults,
  AxiosRequestHeaders,
  AxiosResponseHeaders,
  AxiosStatic,
  CancelToken,
  CancelFn,
  CancelExecutor,
  CancelTokenStatic,
  CancelTokenSource,
  Cancel,
  CancelStatic
}
