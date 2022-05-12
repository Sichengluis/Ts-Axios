import Cancel, { isCancel } from '../../src/cancel/Cancel'

describe('cancel:Cancel', () => {
  //Cancel构造函数
  test('should returns correct result when message is specified', () => {
    const cancel = new Cancel('Operation has been canceled.')
    expect(cancel.message).toBe('Operation has been canceled.')
  })

  // 参数为Cancel类的实例时，isCancel方法返回true
  test('should returns true if object is a Cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })

  // 参数为非Cancel类的实例时，isCancel方法返回false
  test('should returns false if object is not a Cancel', () => {
    expect(isCancel({ foo: 'bar' })).toBeFalsy()
  })
})
