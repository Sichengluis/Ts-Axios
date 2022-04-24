/*
 * @Author: Lisc
 * @Date: 2022-04-20 09:01:20
 * @Description: helpers模块单元测试
 */

import {
  isDate,
  isPlainObject,
  isFormData,
  isURLSearchParams,
  extend,
  deepCopy,
} from '../../src/utils/helpers'

describe('utils:helpers', () => {
  describe('isXXX', () => {
    // 测试date对象的判断函数
    test('validate date format', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })
    // 测试plainObject对象的判断函数
    test('validate plainObject format', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })
    // 测试formData对象的判断函数
    test('validate formData format', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })
    // 测试URLSearchParams对象的判断函数
    test('validate URLSearchParams formate', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('a=b&c=d')).toBeFalsy()
    })
  })
  describe('extend', () => {
    // 有相同的属性名时，属性值会覆盖
    test('same filed should be merged', () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 2 }
      extend(obj1, obj2)
      expect(obj1.a).toBe(2)
    })
    // 函数的返回值为复制后的对象
    test('function should return merged object', () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 2 }
      const obj3 = extend(obj1, obj2)
      expect(obj3.a).toBe(2)
    })
    // 复制后，target中会包括原本不存在的source中的属性
    test('target object should extend properties', () => {
      const obj1 = { a: 1, b: 4 }
      const obj2 = { b: 2, c: 3 }
      const obj3 = extend(obj1, obj2)
      expect(obj3.a).toBe(1)
      expect(obj3.b).toBe(2)
      expect(obj3.c).toBe(3)
    })
  })
  describe('deepCopy', () => {
    // 拷贝后源对象应该是不变的
    test('source object should be immutable', () => {
      var obj = {
        id: 1,
        name: 'andy',
        msg: {
          age: 18,
        },
        color: ['pink', 'red'],
      }
      const objCopy = deepCopy(obj)
      expect(obj).toEqual({
        id: 1,
        name: 'andy',
        msg: {
          age: 18,
        },
        color: ['pink', 'red'],
      })
    })
    // 拷贝后的对象和源对象存储在不同的地址
    test('new object should be a different reference', () => {
      var obj = {
        id: 1,
        name: 'andy',
        msg: {
          age: 18,
        },
        color: ['pink', 'red'],
      }
      const objCopy = deepCopy(obj)
      expect(obj).not.toBe(objCopy)
      obj.msg.age = 20
      expect(objCopy.msg.age).toBe(18)
    })
    // 当参数为多个对象时，对象中基本类型的值会被覆盖
    test('fields of value type need to be merged', () => {
      const a = { foo: 123 }
      const b = { foo: 789 }
      const c = deepCopy(a, b)
      expect(c.foo).toBe(789)
    })
    // 当参数为多个对象时，对象中引用类型的值会合并
    test('fields of reference type need to be merged', () => {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 } }
      const c = deepCopy(a, b)

      expect(c).toEqual({
        foo: {
          bar: 123,
          baz: 456,
        },
      })
    })
    // 会拷贝多层
    test('should merge recursively', () => {
      var obj = {
        id: 1,
        name: 'andy',
        msg: {
          name: 'hello',
          body: {
            info: 'how are you',
          },
        },
        color: ['pink', 'red'],
      }
      const objCopy = deepCopy(obj)
      expect(objCopy).toEqual({
        id: 1,
        name: 'andy',
        msg: {
          name: 'hello',
          body: {
            info: 'how are you',
          },
        },
        color: ['pink', 'red'],
      })
      expect(objCopy.msg.name).toBe('hello')
      expect(objCopy.msg.body.info).toBe('how are you')
    })
    // 测试参数中存在null，undefined和空对象的情况
    test('should handle null, undefined and empty object arguments', () => {
      expect(deepCopy(null, null)).toEqual({})
      expect(deepCopy(null, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepCopy({ foo: 123 }, null)).toEqual({ foo: 123 })

      expect(deepCopy(undefined, undefined)).toEqual({})
      expect(deepCopy(undefined, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepCopy({ foo: 123 }, undefined)).toEqual({ foo: 123 })

      const a = { foo: { bar: 123 } }
      const b = {}
      const c = deepCopy(a, b)

      expect(c).toEqual({
        foo: {
          bar: 123,
        },
      })
    })
  })
})
