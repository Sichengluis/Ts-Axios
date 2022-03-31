/*
 * @Author: Lisc
 * @Date: 2022-03-30 21:09:13
 * @Description: 日期相关工具类
 */
const ObjectTostring = Object.prototype.toString
/**
 * @description: 判断一个类型是否为日期类型
 * @param {any} d
 * @return {*}
 */
function dateOrNot(d: any): d is Date {
  return ObjectTostring.call(d) === '[object Date]'
}

export { dateOrNot }
