/*
 * @Author: Lisc
 * @Date: 2022-04-07 17:41:20
 * @Description: 请求和响应数据转换函数 的处理逻辑
 */

import { TransformFn } from '../types'

export default function transform(data: any, headers: any, fns?: TransformFn | TransformFn[]): any {
  if (!fns) {
    return data
  }
  // 将转换函数统一成数组形式
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
