# 快速上手

在上手前，我们需要先了解一下 insight。 insight 在保证一个系统的操作体验基础上，实现了各个子应用的独立开发和部署。主应用只要安装 insight，便能通过 insight 来管理子应用的注册和渲染，并统计子应用信息，将各个子应用与主应用彻底解耦。

它具备如下特性：

- 子应用独立开发并部署为 web 服务，可以是任意技术栈
- 主应用只需要安装 @game/insight 来管理子应用，不与子应用产生任何耦合
- 现有的 web 服务很容易改造成子应用，接入成本极低
- 主应用和子应用同属于一个系统环境，用户体验好

![](../assets/framework.png)

**由于子应用的资源，包括 `index.html` 文件是通过 `window.fetch` 来获取，然后插入到当前主应用的文档中的，所以对于子应用中的接口、资源请求不能使用相对路径（除非子应用和主应用域名一致）。因为如果使用相对路径在独立访问时是使用子应用的域名，而集成到主应用后是使用主应用的域名。**

**也就是说当子应用集成到主应用后，是没有子应用域名的概念的，这一点在接入或者开发子应用时尤其注意。**

## 主应用

### 1. 安装 insight

```bash
npm i @game/insight -S
```

### 2. 在主应用中注册子应用

```js
import { registerMicroApps, start } from '@game/insight'

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

当子应用信息注册完之后，insight 内部维护了所有子应用的配置信息，包括路由规则、web 服务地址等，同时劫持了 window.history 相关的几个跳转事件，一旦浏览器的 url 发生变化，便会自动触发 insight 的匹配逻辑，所有 activeRule 规则匹配上的子应用就会被插入到指定的 container 中，同时依次调用子应用暴露出的生命周期钩子。

如果子应用不是直接跟路由关联的时候，也可以选择手动加载子应用的方式：

```js
import { loadMicroApp } from '@game/insight'

// 加载子应用
loadMicroApp({
  name: 'gamecard',
  entry: '//localhost:7104/game-card/',
  container: '#gamecard-container',
  props: {
    moduleId: 184,
    origin: 'demo'
  }
})
```

## 子应用

子应用不需要额外安装任何其他依赖即可接入 insight 主应用，对于使用 webpack 等打包工具的情况只需要在子应用入口导出相应的生命周期钩子即可。

### 1. 导出相应的生命周期钩子

子应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 `bootstrap`、`mount`、`unmount` 三个生命周期钩子，以供主应用在适当的时机调用。

```jsx
/**
 * bootstrap 只会在子应用初始化的时候调用一次，下次子应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('micro app bootstraped')
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'))
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载子应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root')
  )
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载子应用时生效
 */
export async function update(props) {
  console.log('update props', props)
}
```

insight 基于 single-spa，所以你可以在[这里](https://single-spa.js.org/docs/building-applications.html#registered-application-lifecycle)找到更多关于子应用生命周期相关的文档说明。

### 2. 配置子应用的打包工具

在子应用中导出相应的生命周期钩子还不够，为了让主应用能正确识别子应用导出的生命周期钩子，子应用的打包工具需要增加如下配置：

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

> jsonpFunction 用于异步加载(async load) chunk，webpack5 去掉了此配置，所以 webpack5 时可以不设置此选项

相关配置介绍可以查看 [webpack 相关文档](https://webpack.js.org/configuration/output/#outputlibrary)。

**insight 默认是取最后一个 js 文件中导出的生命周期钩子**，类似如下子应用，导出的生命周期钩子应该在 app.13657992.js 中，如果 webpack 配置中配置了多个入口，请保证导出生命周期钩子的入口在最后一个。

```html
<body>
  <div id="app"></div>
  <script src="/game-card/js/chunk-vendors.6577f8f7.js"></script>
  <script src="/game-card/js/app.13657992.js"></script>
</body>
```

**否则，你需要增加 entry 字段来手动指定哪一个 js 文件，导出了生命周期钩子**，如下所示：

```html
<body>
  <div id="app"></div>
  <script src="/game-card/js/app.13657992.js" entry></script>
  <script src="/game-card/js/chunk-vendors.6577f8f7.js"></script>
</body>
```

对于非 webpack 构建的子应用，需要额外声明一个 script，用于导出相对应的生命周期钩子。
例如:

### 1. 声明 entry 入口

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

2. 在 entry js 里导出生命周期钩子到 window 上

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

你可以直接参照 examples 中 purehtml 部分的代码。
