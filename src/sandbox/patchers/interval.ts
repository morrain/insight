/* eslint-disable no-param-reassign */
import { noop } from '../../utils'

const rawWindowInterval = window.setInterval
const rawWindowClearInterval = window.clearInterval

export default function patch(global: Window) {
  let intervals: number[] = []

  global.clearInterval = (intervalId: number) => {
    intervals = intervals.filter(id => id !== intervalId)
    return rawWindowClearInterval(intervalId)
  }

  global.setInterval = (handler: Function, timeout?: number, ...args: any[]) => {
    const intervalId = rawWindowInterval(handler, timeout, ...args)
    intervals = [...intervals, intervalId]
    return intervalId
  }

  return function free() {
    intervals.forEach(id => global.clearInterval(id))
    global.setInterval = rawWindowInterval
    global.clearInterval = rawWindowClearInterval

    return noop
  }
}
