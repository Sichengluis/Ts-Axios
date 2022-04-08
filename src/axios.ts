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

axios.create = function(config?: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios
