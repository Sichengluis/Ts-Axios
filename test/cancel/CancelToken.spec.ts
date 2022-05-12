import CancelToken from '../../src/cancel/CancelToken'
import Cancel from '../../src/cancel/Cancel'
import { CancelFn } from '../../src/types'

describe('cancel:CancelToken', () => {
  // 返回cancel函数以供取消请求
  test('should returns a cancel function', (done) => {
    let cancel: CancelFn
    let token = new CancelToken((c) => {
      cancel = c
    })
    cancel!('Operation has been canceled.')
    expect(token.reason).toEqual(expect.any(Cancel))
    expect(token.reason!.message).toBe('Operation has been canceled.')
    token.promise.then((value) => {
      expect(value).toEqual(expect.any(Cancel))
      expect(value.message).toBe('Operation has been canceled.')
      done()
    })
  })

  // 使用source方法生成token和cancel来取消请求
  test('should returns an object containing token and cancel function', () => {
    const source = CancelToken.source()
    expect(source.token).toEqual(expect.any(CancelToken))
    expect(source.cancel).toEqual(expect.any(Function))
    expect(source.token.reason).toBeUndefined()
    source.cancel('Operation has been canceled.')
    expect(source.token.reason).toEqual(expect.any(Cancel))
    expect(source.token.reason!.message).toBe('Operation has been canceled.')
  })

  // 多次取消请求
  test('should support call cancel function for multi times', () => {
    let cancel: CancelFn
    let token = new CancelToken((c) => {
      cancel = c
    })
    cancel!('Operation has been canceled.')
    cancel!('Operation has been canceled.')
    expect(token.reason).toEqual(expect.any(Cancel))
    expect(token.reason!.message).toBe('Operation has been canceled.')
  })

  //
  test('should throws if cancellation has been requested', () => {
    let cancel: CancelFn
    const token = new CancelToken((c) => {
      cancel = c
    })
    cancel!('Operation has been canceled.')
    try {
      // 抛出异常会导致测试用例失败，而我们要判断抛出异常是不是Cancel类型，所以需要catch住
      token.throwIfRequested()
      // fail函数代表此测试用例失败，如果throwIfRequested没抛出异常执行到了这句话，则测试失败了
      fail('Expected throwIfRequested to throw.')
    } catch (thrown) {
      expect(thrown).toEqual(expect.any(Cancel))
      expect((thrown as Cancel).message).toBe('Operation has been canceled.')
    }
  })
})
