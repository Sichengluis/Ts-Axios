/*
 * @Author: Lisc
 * @Date: 2022-04-03 16:22:01
 * @Description: Axios类是Axios接口的底层实现,但是并不是严格意义的实现类
 * 因为request接口中只有config一个参数,而实现类有两个
 * 这样做是为了达到外界调用request方法时只能传入config对象的效果
 */

import {
  AxiosDefaultRequestConfig,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  RejectedFn,
  ResolvedFn,
} from '../types'
import dispatchRequest, { transformUrl } from './dispatchRequest'
import InterceptorManager from './interceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChainItem<T> {
  resolve: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  reject?: RejectedFn
}

export default class Axios {
  defaults: AxiosDefaultRequestConfig
  interceptors: Interceptors
  constructor(initConfig: AxiosDefaultRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>(),
    }
  }

  /**
   * @description: 直接以函数形式(两种方式)调用axios 和 调用axios的别名(request,get,post等)时,底层的实现方法
   * @param {any} urlOrConfig
   * @param {AxiosRequestConfig} config
   * @return {*}
   */
  request(urlOrConfig: any, config?: any): AxiosPromise {
    // 支持直接传入配置对象和传入url和配置对象两种调用方式
    if (typeof urlOrConfig === 'string') {
      if (!config) {
        config = {}
      }
      config.url = urlOrConfig
    } else {
      config = urlOrConfig
    }

    config = mergeConfig(this.defaults, config)
    config.method = config.method.toLowerCase()

    //拦截器链式调用
    const chain: PromiseChainItem<any>[] = [
      // 初始化Promise链,最开始只有发送请求的resolve
      {
        resolve: dispatchRequest,
      },
    ]

    // 遍历拦截器并添加到Promise链
    this.interceptors.request.forEach((interceptor) => {
      // 请求拦截器后添加的先执行
      chain.unshift(interceptor)
    })
    this.interceptors.response.forEach((interceptor) => {
      // 响应拦截器先添加的先执行
      chain.push(interceptor)
    })

    //初始化一个resolve了config对象的promise对象
    //这里resolve了config对象,第一个then函数的resolve回调才能拿到config
    //并对config进行加工
    let promise = Promise.resolve(config)

    //链式调用
    while (chain.length) {
      const { resolve, reject } = chain.shift()!
      promise = promise.then(resolve, reject)
    }
    // 最终返回给用户的promise
    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('delete', url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('head', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('post', url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('put', url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('patch', url, data, config)
  }
  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformUrl(config)
  }

  /**
   * @description: 支持get、delete、head和options方法
   * @param {Method} method
   * @param {string} url
   * @param {AxiosRequestConfig} config
   * @return {*}
   */
  _requestWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
      })
    )
  }
  /**
   * @description: 支持post、put、patch方法
   * @param {*}
   * @return {*}
   */
  _requestWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data,
      })
    )
  }
}
