const isIE11 = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1

function shouldSkipProperty(global, p) {
  if (!Object.prototype.hasOwnProperty.call(global, p) || (!isNaN(p) && p < global.length)) return true

  if (isIE11) {
    // https://github.com/kuitos/import-html-entry/pull/32，最小化 try 范围
    try {
      return global[p] && typeof window !== 'undefined' && global[p].parent === window
    } catch (err) {
      return true
    }
  } else {
    return false
  }
}

// safari unpredictably lists some new globals first or second in object order
let firstGlobalProp, secondGlobalProp, lastGlobalProp

export function getGlobalProp(global) {
  let cnt = 0
  let lastProp
  let hasIframe = false

  for (const p in global) {
    if (shouldSkipProperty(global, p)) continue

    // 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断
    for (let i = 0; i < window.frames.length && !hasIframe; i++) {
      const frame = window.frames[i]
      if (frame === global[p]) {
        hasIframe = true
        break
      }
    }

    if (!hasIframe && ((cnt === 0 && p !== firstGlobalProp) || (cnt === 1 && p !== secondGlobalProp))) return p
    cnt++
    lastProp = p
  }

  if (lastProp !== lastGlobalProp) return lastProp
}

export function noteGlobalProps(global) {
  // alternatively Object.keys(global).pop()
  // but this may be faster (pending benchmarks)
  firstGlobalProp = secondGlobalProp = undefined

  for (const p in global) {
    if (shouldSkipProperty(global, p)) continue
    if (!firstGlobalProp) firstGlobalProp = p
    else if (!secondGlobalProp) secondGlobalProp = p
    lastGlobalProp = p
  }

  return lastGlobalProp
}

export function getInlineCode(match) {
  const start = match.indexOf('>') + 1
  const end = match.lastIndexOf('<')
  return match.substring(start, end)
}

export function defaultGetPublicPath(entry) {
  if (typeof entry === 'object') {
    return '/'
  }
  try {
    // URL 构造函数不支持使用 // 前缀的 url
    const { origin, pathname } = new URL(entry.startsWith('//') ? `${location.protocol}${entry}` : entry, location.href)
    const paths = pathname.split('/')
    // 移除最后一个元素
    paths.pop()
    return `${origin}${paths.join('/')}/`
  } catch (e) {
    console.warn(e)
    return ''
  }
}

// Detect whether browser supports `<script type=module>` or not
export function isModuleScriptSupported() {
  const s = document.createElement('script')
  return 'noModule' in s
}

// RIC and shim for browsers setTimeout() without it
export const requestIdleCallback =
  window.requestIdleCallback ||
  function requestIdleCallback(cb) {
    const start = Date.now()
    return setTimeout(() => {
      const p = {
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start))
        }
      }
      cb(p)
    }, 1)
  }
