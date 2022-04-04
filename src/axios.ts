/*
 * @Author: Lisc
 * @Date: 2022-03-30 15:48:07
 * @Description:
 */
import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './utils/helpers'
/**
 * @description: 创建Axios混合对象
 * @param {*}
 * @return {*}
 */
function createInstance(): AxiosInstance {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()
export default axios
