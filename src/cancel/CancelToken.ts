/*
 * @Author: Lisc
 * @Date: 2022-04-09 14:46:05
 * @Description: CancelToken 类
 */

import { CancelExecutor, CancelFn, CancelTokenSource } from '../types'

import Cancel from './Cancel'

interface ResolveFn {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  // CancelToken 的构造函数参数支持传入一个 executor 函数，executor函数的参数也是一个函数（取消函数）
  constructor(executor: CancelExecutor) {
    let resolveFn: ResolveFn
    this.promise = new Promise<Cancel>(resolve => {
      resolveFn = resolve as ResolveFn
    })
    // 外部调用cancel方法时的执行逻辑
    // 调用外部传入的executor函数，并为executor函数传入函数作为参数（函数即取消函数的逻辑）
    executor(message => {
      // 防止多次调用cancel方法
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolveFn(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }
  /**
   * @description: CancelToken工厂方法
   * @param {*}
   * @return {*}
   */
  static source(): CancelTokenSource {
    let cancel!: CancelFn
    // 此处的c即为构造函数中执行executor时传入的函数参数
    // 从而完成了将类内的函数传递到类外调用的目的
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
