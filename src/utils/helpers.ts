/*
 * @Author: Lisc
 * @Date: 2022-03-30 21:09:13
 * @Description: 工具类
 */
const Tostring = Object.prototype.toString

/**
 * @description: 判断一个对象是不是普通对象（是不是通过 "{}" 或者 "new Object" 创建的）
 * @param {any} o
 * @return {*}
 */
function plainObjectOrNot(o: any): o is object {
  return Tostring.call(o) === '[object Object]'
}

/**
 * @description: 将from对象的所有成员复制到to对象
 * @param {T} to
 * @param {U} from
 * @return {*}
 */
function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    // debugger
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/**
 * @description: 判断一个类型是否为日期类型
 * @param {any} d
 * @return {*}
 */
function dateOrNot(d: any): d is Date {
  return Tostring.call(d) === '[object Date]'
}

export { plainObjectOrNot, extend, dateOrNot }
