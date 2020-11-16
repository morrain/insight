# 快速上手

## 主应用

### 1. 安装 insight

```bash
npm i insight -S
```

### 2. 在主应用中注册微应用

```ts
import { registerMicroApps, start } from 'insight'

registerMicroApps([
  {
    name: 'vue',
    entry: '//localhost:7101',
    container: '#subapp-viewport',
    loader,
    activeRule: '/vue'
  },
  {
    name: 'purehtml',
    entry: '//localhost:7102',
    container: '#subapp-viewport',
    loader,
    activeRule: '/purehtml'
  },
  {
    name: 'vue3',
    entry: '//localhost:7103',
    container: '#subapp-viewport',
    loader,
    activeRule: '/vue3'
  }
])

start()
```

当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 insight 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。

如果微应用不是直接跟路由关联的时候，你也可以选择手动加载微应用的方式：

```ts
import { loadMicroApp } from 'insight'

loadMicroApp({
  name: 'vue3',
  entry: '//localhost:7101',
  container: '#subapp-container1',
  props: {
    id: '123456'
  }
})
```

## 微应用

微应用不需要额外安装任何其他依赖即可接入 insight 主应用。

### 1. 导出相应的生命周期钩子

微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 `bootstrap`、`mount`、`unmount` 三个生命周期钩子，以供主应用在适当的时机调用。

```jsx
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped')
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'))
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root')
  )
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props)
}
```

insight 基于 single-spa，所以你可以在[这里](https://single-spa.js.org/docs/building-applications.html#registered-application-lifecycle)找到更多关于微应用生命周期相关的文档说明。

### 2. 配置微应用的打包工具

除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别微应用暴露出来的一些信息，微应用的打包工具需要增加如下配置：

#### webpack:

```js
const packageName = require('./package.json').name

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`
  }
}
```

相关配置介绍可以查看 [webpack 相关文档](https://webpack.js.org/configuration/output/#outputlibrary)。

### 3. 非 webpack 构建的微应用如何接入？

需要额外声明一个 script，用于 export 相对应的 lifecycles

例如:

1. 声明 entry 入口

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Purehtml Example</title>
    <script src="//cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
  </head>
  <body>
    <div style="display: flex; justify-content: center; align-items: center; height: 200px;">Purehtml Example</div>
    <div id="purehtml-container" style="text-align:center"></div>
    <script src="//localhost:7102/entry.js" entry></script>
  </body>
</html>
```

2. 在 entry js 里声明 lifecycles

```javascript
const render = $ => {
  $('#purehtml-container').html('Hello, render with jQuery')
  return Promise.resolve()
}

;(global => {
  global['purehtml'] = {
    bootstrap: () => {
      console.log('purehtml bootstrap')
      return Promise.resolve()
    },
    mount: () => {
      console.log('purehtml mount')
      return render($)
    },
    unmount: () => {
      console.log('purehtml unmount')
      return Promise.resolve()
    }
  }
})(window)
```

你可以直接参照 examples 中 purehtml 部分的代码
