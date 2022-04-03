/*
 * @Author: Lisc
 * @Date: 2022-03-30 21:13:44
 * @Description:
 */
/**
 * @description: 判断一个对象是不是普通对象（是不是通过 "{}" 或者 "new Object" 创建的）
 * @param {any} o
 * @return {*}
 */
export default function plainObjectOrNot(o: any): o is object {
  return Object.prototype.toString.call(o) === '[object Object]'
}
