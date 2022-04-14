/*
 * @Author: Lisc
 * @Date: 2022-04-06 18:37:46
 * @Description: 默认配置和用户配置合并
 */

import { AxiosDefaultRequestConfig, AxiosRequestConfig } from '../types'
import { deepCopy, isPlainObject } from '../utils/helpers'

const strategiesMap = Object.create(null)

/**
 * @description: 配置的默认合并策略,用户没有配置的字段,使用默认配置
 * @param {any} defaultVal
 * @param {any} userVal
 * @return {*}
 */
function defaultStrategy(defaultVal: any, userVal: any): any {
  return typeof userVal === 'undefined' ? defaultVal : userVal
}

/**
 * @description: 特殊字段配置合并策略,只使用用户的配置
 * @param {any} defaultVal
 * @param {any} userVal
 * @return {*}
 */
function fromUserStrategy(defaultVal: any, userVal: any): any {
  if (typeof userVal !== 'undefined') {
    return userVal
  }
}

/**
 * @description:
 * @param {any} defaultVal
 * @param {any} userVal
 * @return {*}
 */
function deepMergeStrategy(defaultVal: any, userVal: any): any {
  if (isPlainObject(userVal)) {
    // 用户设置的值为对象,和默认配置对象合并
    return deepCopy(defaultVal, userVal)
  } else if (typeof userVal !== 'undefined') {
    // 用户设置的值为null
    return userVal
  }
  // 用户没有设置值,使用默认配置
  else if (isPlainObject(defaultVal)) {
    return deepCopy(defaultVal)
  } else {
    return defaultVal
  }
}

const fromUserStrategyKeys = ['url', 'params', 'data']
fromUserStrategyKeys.forEach(key => {
  strategiesMap[key] = fromUserStrategy
})

const deepMergeStrategyKeys = ['headers']
deepMergeStrategyKeys.forEach(key => {
  strategiesMap[key] = deepMergeStrategy
})

export default function mergeConfig(
  defaultConfig: AxiosDefaultRequestConfig,
  userConfig?: AxiosRequestConfig
): AxiosDefaultRequestConfig {
  if (!userConfig) {
    userConfig = {}
  }
  const config = Object.create(null)
  for (let key in userConfig) {
    merge(key)
  }
  for (let key in defaultConfig) {
    if (!userConfig[key]) {
      merge(key)
    }
  }
  function merge(key: string): void {
    // 不同的key对应不同的合并策略函数
    const strategy = strategiesMap[key] || defaultStrategy
    // 使用合并策略函数进行合并
    config[key] = strategy(defaultConfig[key], userConfig![key])
  }
  return config
}
