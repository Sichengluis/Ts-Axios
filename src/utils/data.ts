/*
 * @Author: Lisc
 * @Date: 2022-03-31 10:12:20
 * @Description: 处理请求配置对象中的data
 */
import plainObjectOrNot from './object'

function transformRequestData(data: any): any {
  if (plainObjectOrNot(data)) {
    return JSON.stringify(data)
  }
  return data
}

export { transformRequestData }
