/*
 * @Author: Lisc
 * @Date: 2022-03-31 10:12:20
 * @Description: 处理请求配置对象中的data
 */
import plainObjectOrNot from './object'

/**
 * @description: xhr不支持传递对象作为data数据，对象需要转成JSon字符串
 * @param {any} data
 * @return {*}
 */
function transformRequestData(data: any): any {
  if (plainObjectOrNot(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * @description: 如果返回response中的data是Json字符串，即使用户没有设置responseType为json
 * 也将其转换成Json对象方便操作
 * @param {any} data
 * @return {*}
 */
function transformResponseData(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      // do nothing here
    }
  }
  return data
}

export { transformRequestData, transformResponseData }
