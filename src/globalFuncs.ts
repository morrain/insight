/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { isFunction } from 'lodash'
import { GlobalFuncsActions } from './interfaces'

// 记录不同微服务注册的全局函数 map
const appsFuncs: Record<string, Record<string, Function>> = {}
// 记录微服务启动前，原生window上已经注册的同名函数 map
const winFuncs: Record<string, Function> = {}

/**
 * 加载微服务时调用，获取注册全局函数的接口，并传递给微服务使用
 * @param id 微服务的实例id
 * @param win 全局window
 */
export function getGlobalFuncsActions(id: string, win: any): GlobalFuncsActions {
  // 生成记录当前微服务全局函数的 map
  const map: Record<string, Function> = {}
  appsFuncs[id] = map

  return {
    setGlobalFunction(funcName: string, func: Function): void {
      // 同一个微服务下，注册的全局函数会被覆盖
      map[funcName] = func

      const reference = countReference(funcName) // 查一下引用计数
      if (reference > 1) return // 已经注册过，就直接返回了。否则说明是第一次注册，要考虑备份之前的函数

      const originFun = winGetter(win, funcName)
      if (originFun) {
        // 如果第一次注册此函数，并且原生window已经存在，就存在缓存中
        winFuncs[funcName] = originFun
      }
      winSetter(win, funcName, (...args: any[]) => {
        // 全局函数被调用后，先调用之前的函数，再调用微服务注册上来的函数
        if (isFunction(winFuncs[funcName])) winFuncs[funcName](...args)
        Object.keys(appsFuncs).forEach(m => {
          const target = appsFuncs[m]

          for (const fN in target) {
            // 遍历注册的所有函数
            if (Object.prototype.hasOwnProperty.call(target, fN) && fN === funcName) {
              const f = target[fN]
              if (isFunction(f)) f(...args)
              return
            }
          }
        })
      })
    },

    offGlobalFunctions() {
      const map = appsFuncs[id]
      if (!map) return
      Object.keys(map).forEach((funcName: string) => {
        delete map[funcName]

        // 检查引用计数，如果为0, 把之前缓存的函数恢复
        const reference = countReference(funcName)
        if (reference === 0) {
          winSetter(win, funcName, winFuncs[funcName])
        }
      })
    }
  }
}
/**
 * 查询当前函数是否还注册在微服务当中
 * @param funcName 要查询引用计数的函数名
 */
function countReference(funcName: string): number {
  return Object.keys(appsFuncs).reduce((acc, current) => {
    return acc + (Object.keys(appsFuncs[current]).includes(funcName) ? 1 : 0)
  }, 0)
}

/**
 * 取window上的值
 * @param win 全局 window
 * @param funcName 函数名，支持用.分隔的多级。譬如 'a.b' 表示取 window.a.b的值
 */
function winGetter(win: any, funcName: string): any {
  if (funcName === '') return

  const ns = funcName.split('.')
  let curr = win
  let len = ns.length
  while (len > 0) {
    curr = curr[ns[ns.length - len--]]
    if (!curr) break
  }

  return curr
}
/**
 * 挂载函数到全局
 * @param win 全局 window
 * @param handler 往全局window挂载的函数。支持 'a.b.c'
 */
function winSetter(win: any, funcName: string, handler: Function): void {
  if (funcName === '') return

  const ns = funcName.split('.')
  let target = win
  let len = ns.length
  while (len > 0) {
    if (len === 1) {
      if (handler) target[ns[ns.length - len--]] = handler
      else delete target[ns[ns.length - len--]]
    } else {
      target = target[ns[ns.length - len--]]

      if (!target) {
        console.error('[insight] funcName levels must be valided!')
        break
      }
    }
  }
}
