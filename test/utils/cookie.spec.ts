/*
 * @Author: Lisc
 * @Date: 2022-04-21 20:02:12
 * @Description: cookie模块单元测试
 */
import cookie from '../../src/utils/cookie'

describe('utils:cookie', () => {
  // 读取存在的cookie
  test('read cookie', () => {
    document.cookie = 'a=b;c=d'
    expect(cookie.getCookie('a')).toBe('b')
  })
  // 读取不存在的cookie
  test('read not exist cookie', () => {
    document.cookie = 'a=b;c=d'
    expect(cookie.getCookie('e')).toBeNull()
  })
})
