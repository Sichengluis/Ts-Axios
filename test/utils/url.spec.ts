/*
 * @Author: Lisc
 * @Date: 2022-04-22 11:25:54
 * @Description: url模块单元测试
 */
import { getUrlWithParams, isAbsoluteURL, combineURL, isURLSameOrigin } from '../../src/utils/url'

describe('uitls:url', () => {
  describe('getUrlWithParams', () => {
    // 只有url没有params参数的情况
    test('should support url with no params', () => {
      expect(getUrlWithParams('/foo')).toBe('/foo')
    })
    // params对象的属性值为字符串的情况
    test('should support url with string params', () => {
      //一个参数
      expect(
        getUrlWithParams('/foo', {
          foo: 'bar',
        })
      ).toBe('/foo?foo=bar')
      //两个参数
      expect(
        getUrlWithParams('/foo', {
          foo: 'bar',
          bar: 'baz',
        })
      ).toBe('/foo?foo=bar&bar=baz')

      // url已经存在参数
      expect(
        getUrlWithParams('/foo?a=b', {
          c: 'd',
        })
      ).toBe('/foo?a=b&c=d')

      expect(
        getUrlWithParams('/foo?a=b&c=d', {
          e: 'f',
        })
      ).toBe('/foo?a=b&c=d&e=f')
    })
    // params对象的属性值为null的情况
    test('should support null as params', () => {
      //唯一的参数为null
      expect(
        getUrlWithParams('/foo', {
          foo: null,
        })
      ).toBe('/foo')

      //参数中其一为null
      expect(
        getUrlWithParams('/foo', {
          foo: 'foo',
          bar: null,
        })
      ).toBe('/foo?foo=foo')

      // 路径包括参数且唯一参数为null
      expect(
        getUrlWithParams('/foo?foo=foo', {
          bar: null,
        })
      ).toBe('/foo?foo=foo')

      // 路径包括参数且参数中其一为null
      expect(
        getUrlWithParams('/foo?bar=baz', {
          foo: 'foo',
          baz: null,
        })
      ).toBe('/foo?bar=baz&foo=foo')
    })
    // params对象的属性值为对象的情况
    test('should support url with object params', () => {
      expect(
        getUrlWithParams('/foo', {
          foo: {
            bar: 'baz',
          },
        })
      ).toBe('/foo?foo=' + encodeURI('{"bar":"baz"}'))
    })
    // params对象的属性值为date的情况
    test('should support url with date params', () => {
      const date = new Date()
      expect(
        getUrlWithParams('/foo', {
          date: date,
        })
      ).toBe('/foo?date=' + date.toISOString())
    })
    // params对象的属性值为array的情况
    test('should support url with array params', () => {
      expect(
        getUrlWithParams('/foo', {
          foo: ['bar', 'baz'],
        })
      ).toBe('/foo?foo[]=bar&foo[]=baz')
    })
    // params对象的属性值为特殊字符的情况
    test('should support url with special char params', () => {
      expect(
        getUrlWithParams('/foo', {
          foo: '@:$, ',
        })
      ).toBe('/foo?foo=@:$,+')
    })
    // 测试是否自动去掉url中的锚点
    test('should discard url hash mark', () => {
      expect(
        getUrlWithParams('/foo?foo=bar#hash', {
          query: 'baz',
        })
      ).toBe('/foo?foo=bar&query=baz')
    })
    // URLSearchParams作为参数
    test('should support URLSearchParams', () => {
      const usp = new URLSearchParams('bar=baz')
      expect(getUrlWithParams('/foo?foo=bar', usp)).toBe('/foo?foo=bar&bar=baz')
    })
    //自定义参数序列化
    test('should support serializer', () => {
      const mockFn = jest.fn().mockReturnValue('foo=foo')
      let params = {
        foo: 'foo',
      }
      expect(getUrlWithParams('/foo', params, mockFn)).toBe('/foo?foo=foo')
      expect(mockFn).toBeCalled()
      expect(mockFn).toBeCalledWith(params)
    })
  })
  describe('isAbsoluteURL', () => {
    // 合法的协议名返回true
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })
    // 非法的协议名返回false
    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })
    // 协议名为空时但是有//也算绝对地址
    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })
    // 相对路径返回false
    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })
  describe('combineURL', () => {
    // 将baseURL和relativeURL拼接
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })
    // 去掉地址之间重复的/
    test('should remove duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })
    // 补充地址之间需要的/
    test('should insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })
    // 相对地址为空时不会补充/
    test('should not insert slash when relative url is empty', () => {
      expect(combineURL('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })
    // 相对地址只有/时也会拼接
    test('should allow a single slash to be relative url', () => {
      expect(combineURL('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })

  describe('isURLSameOrigin', () => {
    // 测试同源
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })
    // 测试不同源
    test('should detect different origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
})
