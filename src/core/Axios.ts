/*
 * @Author: Lisc
 * @Date: 2022-04-03 16:22:01
 * @Description: Axios类是Axios接口的底层实现,但是并不是严格意义的实现类
 * 因为request接口中只有config一个参数,而实现类有两个
 * 这样做是为了达到外界调用request方法时只能传入config对象的效果
 */

import { AxiosPromise, AxiosRequestConfig, Method } from '../types'
import dispatchRequest from './dispatchRequest'

export default class Axios {
  /**
   * @description: 直接以函数形式(两种方式)调用axios 和 调用axios的request别名时,底层的实现方法
   * @param {any} urlOrConfig
   * @param {AxiosRequestConfig} config
   * @return {*}
   */
  request(urlOrConfig: any, config?: AxiosRequestConfig): AxiosPromise {
    if (typeof urlOrConfig === 'string') {
      if (!config) {
        config = {}
      }
      config.url = urlOrConfig
    } else {
      config = urlOrConfig
    }
    return dispatchRequest(config!)
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
        url
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
        data
      })
    )
  }
}
