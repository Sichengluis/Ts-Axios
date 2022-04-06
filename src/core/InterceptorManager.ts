import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolve: ResolvedFn<T>
  reject?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = []
  }

  /**
   * @description: 添加拦截器
   * @param {ResolvedFn} resolve
   * @param {RejectedFn} reject
   * @return {*}
   */
  use(resolve: ResolvedFn<T>, reject: RejectedFn): number {
    this.interceptors.push({
      resolve,
      reject
    })
    return this.interceptors.length - 1
  }

  /**
   * @description: 删除拦截器
   * 注意这里不能直接修改原数组,因为id是数组下标,删除元素数组元素个数改变拦截器id会变化
   * @param {number} id
   * @return {*}
   */
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  /**
   * @description: 遍历拦截器,对每个拦截器执行回调函数
   * @param {function} fn
   * @return {*}
   */
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor) {
        fn(interceptor)
      }
    })
  }
}
