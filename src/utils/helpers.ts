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
function isPlainObject(o: any): o is object {
  return Tostring.call(o) === '[object Object]'
}

/**
 * @description: 判断一个类型是否为日期类型
 * @param {any} d
 * @return {*}
 */
function isDate(d: any): d is Date {
  return Tostring.call(d) === '[object Date]'
}

function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

/**
 * @description: 将from对象的所有成员复制到to对象
 * @param {T} to
 * @param {U} from
 * @return {*}
 */
function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/**
 * @description: 深拷贝,支持将多个对象的属性拷贝到一个对象中
 * @param {array} objs
 * @return {*}
 */
function deepCopy(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepCopy(result[key], val)
          } else {
            result[key] = deepCopy(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}

export { isPlainObject, isDate, isFormData, extend, deepCopy, isURLSearchParams }
