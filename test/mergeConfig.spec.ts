import axios from '../src/index'
import mergeConfig from '../src/core/mergeConfig'

describe('mergeConfig', () => {
  const defaults = axios.defaults

  // 用户配置为undefined
  test('should accept undefined as userConfig', () => {
    expect(mergeConfig(defaults, undefined)).toEqual(defaults)
  })

  // 用户配置为空对象
  test('should accept an empty object as userConfig', () => {
    expect(mergeConfig(defaults, {})).toEqual(defaults)
  })

  // 合并后的对象和默认配置对象应该指向不同的内存地址
  test('merged object should be a different references', () => {
    const merged = mergeConfig(defaults, {})
    expect(merged).not.toBe(defaults)
  })

  // url, params and data三个属性只使用用户的配置，如果用户没有配置则为undefined
  test('url, params and data should only use userConfig', () => {
    // 用户配置了值
    const config = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true },
    }
    const mergedConfig = mergeConfig(defaults, config)
    expect(mergedConfig.url).toBe(config.url)
    expect(mergedConfig.params).toBe(config.params)
    expect(mergedConfig.data).toEqual(config.data)
    // 用户没有配置值
    const localDefaults = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true },
      headers: {},
    }
    const merged = mergeConfig(localDefaults, {})
    expect(merged.url).toBeUndefined()
    expect(merged.params).toBeUndefined()
    expect(merged.data).toBeUndefined()
  })

  // url, params and data三个属性之外的配置，如果用户配置为空则使用默认配置
  test('should return default config if userConfig is undefined', () => {
    expect(
      mergeConfig(
        {
          method: 'get',
          timeout: 0,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          headers: {
            common: {
              Accept: 'application/json,text/plain,*/*',
            },
          },
        },
        undefined
      )
    ).toEqual({
      method: 'get',
      timeout: 0,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      headers: {
        common: {
          Accept: 'application/json,text/plain,*/*',
        },
      },
    })
  })

  // merge和auth两个属性应该将用户配置和默认配置合并到一起
  test('should merge userConfig and defaultConfig for auth and headers', () => {
    expect(
      mergeConfig(
        {
          auth: {
            username: 'foo',
            password: 'test',
          },
          headers: {
            common: {
              Accept: 'application/json,text/plain,*/*',
            },
          },
        },
        {
          auth: {
            username: 'baz',
            password: 'foobar',
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
    ).toEqual({
      auth: {
        username: 'baz',
        password: 'foobar',
      },
      headers: {
        common: {
          Accept: 'application/json,text/plain,*/*',
        },
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  })
})
