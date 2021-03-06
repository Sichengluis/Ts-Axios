/*
 * @Author: Lisc
 * @Date: 2022-03-30 15:48:07
 * @Description: Axios混合对象
 */
import { AxiosDefaultRequestConfig, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './utils/helpers'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import Cancel, { isCancel } from './cancel/Cancel'
import CancelToken from './cancel/CancelToken'
/**
 * @description: 创建Axios混合对象
 * @param {*}
 * @return {*}
 */
function createInstance(defaultConfig: AxiosDefaultRequestConfig): AxiosStatic {
  const context = new Axios(defaultConfig)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function (config?: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
axios.all = function (promises) {
  return Promise.all(promises)
}

axios.spread = function (callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios
export default axios
