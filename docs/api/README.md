# API 说明

根据不同的业务场景，加载微应用分为两种模式：

- **手动加载微应用**

  适用于需要手动 加载/卸载 一个微应用的场景，不依赖路由

- **基于路由配置**

  适用于 route-based 场景，根据不同路由加载不同的微应用

由于两种模式底层加载的机制和原理是一样的，所以有一些公共的 api 以及 参数。

## 公共 api 以及数据结构

### `runAfterFirstMounted(callback)`

- 参数

  - callback - `() => void` - 必选

- 用法

  第一个微应用 mount 后需要调用的方法，比如开启一些监控或者埋点脚本。**不管是手动加载还是基于路由模式加载，都会触发此回调。**

- 示例

  ```js
  import { runAfterFirstMounted } from '@game/insight'

  runAfterFirstMounted(() => {
    // do your works
  })
  ```

**如下是两种模式下 api 公共的数据结构，包括参数以及返回值等，这里只需要了解概念即可，具体说明和使用可以参考两种加载模式下具体的 api 说明文档**

### 微应用的基础信息

- app - `LoadableApp` - 必选，微应用的基础信息

  - name - `string` - 必选，微应用的名称，微应用之间必须确保唯一。
  - entry - `string | { scripts?: string[]; styles?: string[]; html?: string }` - 必选，微应用的入口。
    - 配置为字符串时，表示微应用的访问地址，例如 `https://app.com/app1/anything/everything`。
    - 配置为对象时，`html` 的值是微应用的 html 内容字符串，而不是微应用的访问地址。微应用的 `publicPath` 将会被设置为 `/`。
  - container - `string | HTMLElement` - 必选，微应用的容器节点的选择器或者 Element 实例。如`container: '#root'` 或 `container: document.querySelector('#root')`。
  - props - `object` - 可选，初始化时需要传递给微应用的数据。

### 微应用的加载配置

- importEntryOpts - `ImportEntryOpts` - 可选

  - fetch - `Function` - 可选，自定义的 fetch 方法。默认使用 window.fetch
  - getPublicPath - `(entry: Entry) => string` - 可选，参数是微应用的 entry 值。
  - getTemplate - `(tpl: string) => string` - 可选

### 微应用的配置信息

- configuration - `Configuration` - 可选，微应用的配置信息

  - sandbox - `boolean` | `{ strictStyleIsolation?: boolean, experimentalStyleIsolation?: boolean }` - 可选，是否开启沙箱，默认为 `true`。

    默认情况下沙箱可以确保单实例场景子应用之间的样式隔离，但是无法确保主应用跟子应用、或者多实例场景的子应用样式隔离。当配置为 `{ strictStyleIsolation: true }` 时表示开启严格的样式隔离模式。这种模式下 insight 会为每个微应用的容器包裹上一个 [shadow dom](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM) 节点，从而确保微应用的样式不会对全局造成影响。

    基于 ShadowDOM 的严格样式隔离并不是一个可以无脑使用的方案，大部分情况下都需要接入应用做一些适配后才能正常在 ShadowDOM 中运行起来（比如 react 场景下需要解决这些[问题](https://github.com/facebook/react/issues/10422)，使用者需要清楚开启了 `strictStyleIsolation` 意味着什么。后续 insight 会提供更多官方实践文档帮助用户能快速的将应用改造成可以运行在 ShadowDOM 环境的微应用。

    除此以外，insight 还提供了一个实验性的样式隔离特性，当 experimentalStyleIsolation 被设置为 true 时，insight 会改写子应用所添加的样式为所有样式规则增加一个特殊的选择器规则来限定其影响范围，因此改写后的代码会表达类似为如下结构：

    ```css
    // 假设应用名是 vue3
    .app-main {
      font-size: 14px;
    }

    div[data-insight-vue3] .app-main {
      font-size: 14px;
    }
    ```

    注意事项:
    目前 @keyframes, @font-face, @import, @page 等规则不会支持 (i.e. 不会被改写)

  - singular - `boolean | ((app: RegistrableApp<any>) => Promise<boolean>);` - 可选，是否为单实例场景，单实例指的是同一时间只会渲染一个微应用。**手动加载模式默认为 `false`，基于路由模式默认为 `true`**。
  - excludeAssetFilter - `(assetUrl: string) => boolean` - 可选，指定部分特殊的动态加载的微应用资源（css/js) 不被 insight 劫持处理
  - fetch - 见[微应用的加载配置](#微应用的加载配置)
  - getPublicPath - 见[微应用的加载配置](#微应用的加载配置)
  - getTemplate - 见[微应用的加载配置](#微应用的加载配置)

  **微应用配置信息中包括微应用的加载配置字段，也就是`fetch`、`getPublichPath`、`getTemplate`的配置**

### 微应用生命周期配置

- `LifeCycles`

  ```js
  type Lifecycle = (app: LoadableApp) => Promise<any>
  ```

  - beforeLoad - `Lifecycle | Array<Lifecycle>` - 可选
  - beforeMount - `Lifecycle | Array<Lifecycle>` - 可选
  - afterMount - `Lifecycle | Array<Lifecycle>` - 可选
  - beforeUnmount - `Lifecycle | Array<Lifecycle>` - 可选
  - afterUnmount - `Lifecycle | Array<Lifecycle>` - 可选

## 手动加载微应用

通常这种场景下微应用是一个不带路由的可独立运行的业务组件。譬如[游戏卡片](http://gamebbsh5-test.vivo.com.cn/game-card/)、互动能力模块、编辑器等等。

是否使用手动加载模式的微应用来实现业务组件，主要考虑的有如下几个方面：

业务逻辑是否是

- **高复用的**
- **包括大量独立业务逻辑，单纯 UI 组件无法满足需求**
- **更新发布快捷，npm 组件难以快速升级和发布**

但物极必反，微应用也不宜拆分过细，建议按照业务域来做拆分。业务关联紧密的功能单元应该做成一个微应用，反之关联不紧密的可以考虑拆分成多个微应用。
一个判断业务关联是否紧密的标准：**看这个微应用与其他微应用是否有频繁的通信需求**。如果有可能说明这两个微应用本身就是服务于同一个业务场景，合并成一个微应用可能会更合适。

### `prefetchApps(apps, importEntryOpts?)`

- 参数

  - apps - `AppMetadata[]` - 必选 - 预加载的应用列表
  - importEntryOpts - 可选 - 见[微应用的加载配置](#微应用的加载配置)

- 类型

  - `AppMetadata`
    - name - `string` - 可选 - 应用名。**由于预加载只是资源的预加载，并不会实际创建微应用，所以并不需要指定应用名。指定应用名便于开发过程中作区分**
    - entry - `string | { scripts?: string[]; styles?: string[]; html?: string }` - 必选，微应用的 entry 地址

- 用法

  手动预加载指定的微应用静态资源。通过 `AppMetadata` 中配置的 entry 来进行加载并缓存，当实际加载微应用时，根据 entry 来命中缓存，当资源有缓存时不再重新加载，直接使用

- 示例

  ```js
  import { prefetchApps } from '@game/insight'

  prefetchApps([{ name: 'app1', entry: '//locahost:7001' }, { entry: '//locahost:7002' }])
  ```

### `loadMicroApp(app, configuration?, lifeCycles?)`

- 参数

  - app - `LoadableApp` - 必选，见[微应用的基础信息](#微应用的基础信息)
  - configuration - `Configuration` - 可选，见[微应用的配置信息](#微应用的配置信息)。 **手动加载模式下，`singular` 默认值为 `false`**
  - lifeCycles - `LifeCycles` - 可选，见[微应用生命周期配置](#微应用生命周期配置)

  > loadMicroApp 有 configuration 和 lifeCycles 两个可选参数，所以使用时请注意，如果要配置生命周期钩子，必须传参 configuration，可以设置为 null，如下所示：

  ```js
  let cardInstance = loadMicroApp({
      name: 'gamecard',
      entry: '//localhost:7104/game-card/', // 请去游戏卡片工程启动服务 https://gitlab.vmic.xyz/gamehelper/game-card
      container: '#gamecard-container',
      props: {
        moduleId: 184,
        origin: 'demo'
      }
    }, null
    ,{
      beforeLoad: [
        app => {
          console.log('[loadMicroApp][LifeCycle] before load %c%s', 'color: green;', app.name);
        },
      ],
      beforeMount:
        app => {
          console.log('[loadMicroApp][LifeCycle] before mount %c%s', 'color: green;', app.name);
        },
      ,
      afterMount: [
        app => {
          console.log('[loadMicroApp][LifeCycle] after mount %c%s', 'color: green;', app.name);
          update(app.name) // 切换应用后，相应的更新卡片
        },
      ],
      beforeUnmount: [
        app => {
          console.log('[loadMicroApp][LifeCycle] before unmount %c%s', 'color: green;', app.name);
        },
      ],
      afterUnmount: [
        app => {
          console.log('[loadMicroApp][LifeCycle] after unmount %c%s', 'color: green;', app.name);
        },
      ],
    })
  ```

- 返回值 - `MicroApp` - 微应用实例

  - mount(): Promise&lt;null&gt;;
  - unmount(): Promise&lt;null&gt;;
  - update(customProps: object): Promise&lt;any&gt;;
  - getStatus():

    | "NOT_LOADED"
    | "LOADING_SOURCE_CODE"
    | "NOT_BOOTSTRAPPED"
    | "BOOTSTRAPPING"
    | "NOT_MOUNTED"
    | "MOUNTING"
    | "MOUNTED"
    | "UPDATING"
    | "UNMOUNTING"
    | "UNLOADING"
    | "SKIP_BECAUSE_BROKEN"
    | "LOAD_ERROR";

  - loadPromise: Promise&lt;null&gt;;
  - bootstrapPromise: Promise&lt;null&gt;;
  - mountPromise: Promise&lt;null&gt;;
  - unmountPromise: Promise&lt;null&gt;;

- 用法

  手动加载一个微应用。

  如果需要能支持主应用手动 update 的微应用，需要微应用 entry 再多导出一个 update 钩子：

  ```js
  export async function mount(props) {
    renderApp(props)
  }

  // 增加 update 钩子以便主应用手动更新微应用
  export async function update(props) {
    renderPatch(props)
  }
  ```

- 示例

  ```jsx
  import { loadMicroApp } from '@game/insight'
  import React from 'react'

  class App extends React.Component {
    containerRef = React.createRef()
    microApp = null

    componentDidMount() {
      this.microApp = loadMicroApp({
        name: 'app1',
        entry: '//localhost:1234',
        container: this.containerRef.current,
        props: { name: 'insight' }
      })
    }

    componentWillUnmount() {
      this.microApp.unmount()
    }

    componentDidUpdate() {
      this.microApp.update({ name: 'inSight' })
    }

    render() {
      return <div ref={this.containerRef}></div>
    }
  }
  ```

## 基于路由配置

通过将微应用关联到一些 url 规则的方式，实现当浏览器 url 发生变化时，自动加载相应的微应用的功能。

### registerMicroApps(apps, lifeCycles?)

- 参数

  - apps - `Array<RegistrableApp>` - 必选，微应用的一些注册信息
  - lifeCycles - `LifeCycles` - 可选，见[微应用生命周期配置](#微应用生命周期配置)

- 类型

  - `RegistrableApp` - 从 `LoadableApp` 继承而来，见[LoadableApp](#微应用的基础信息)，除了从 `LoadableApp` 继承而来的 name、entry、container、props 外，增加了 activeRule 和 loader 两个和路由相关的配置。

    - name - 见[LoadableApp](#微应用的基础信息)
    - entry - 见[LoadableApp](#微应用的基础信息)
    - container - 见[LoadableApp](#微应用的基础信息)
    - props - 见[LoadableApp](#微应用的基础信息)
    - activeRule - `string | (location: Location) => boolean | Array<string | (location: Location) => boolean> ` - 必选，微应用的激活规则。

      - 支持直接配置字符串或字符串数组，如 `activeRule: '/app1'` 或 `activeRule: ['/app1', '/app2']`，当配置为字符串时会直接跟 url 中的路径部分做前缀匹配，匹配成功表明当前应用会被激活。
      - 支持配置一个 active function 函数或一组 active function。函数会传入当前 location 作为参数，函数返回 true 时表明当前微应用会被激活。如 `location => location.pathname.startsWith('/app1')`。

      规则示例：

      `'/app1'`

      - ✅ https://app.com/app1

      - ✅ https://app.com/app1/anything/everything

      - 🚫 https://app.com/app2

      `'/users/:userId/profile'`

      - ✅ https://app.com/users/123/profile
      - ✅ https://app.com/users/123/profile/sub-profile/
      - 🚫 https://app.com/users//profile/sub-profile/
      - 🚫 https://app.com/users/profile/sub-profile/

      `'/pathname/#/hash'`

      - ✅ https://app.com/pathname/#/hash
      - ✅ https://app.com/pathname/#/hash/route/nested
      - 🚫 https://app.com/pathname#/hash/route/nested
      - 🚫 https://app.com/pathname#/another-hash

      `['/pathname/#/hash', '/app1']`

      - ✅ https://app.com/pathname/#/hash/route/nested
      - ✅ https://app.com/app1/anything/everything
      - 🚫 https://app.com/pathname/app1
      - 🚫 https://app.com/app2

      浏览器 url 发生变化会调用 activeRule 里的规则，`activeRule` 任意一个返回 `true` 时表明该微应用需要被激活。

    - loader - `(loading: boolean) => void` - 可选，loading 状态发生变化时会调用的方法。

- 用法

  注册微应用的基础配置信息。当浏览器 url 发生变化时，会自动检查每一个微应用注册的 `activeRule` 规则，符合规则的应用将会被自动激活。

- 示例

  ```js
  import { registerMicroApps } from '@game/insight'

  registerMicroApps(
    [
      {
        name: 'app1',
        entry: '//localhost:8080',
        container: '#container',
        activeRule: '/vue'
      }
    ],
    {
      beforeLoad: app => console.log('before load', app.name),
      beforeMount: [app => console.log('before mount', app.name)]
    }
  )
  ```

### `start(opts?)`

- 参数

  - opts - `Options` 可选。 从 `Configuration` 继承而来，见[Configuration](#微应用的配置信息)，除了从 `Configuration` 继承而来的 sandbox、singular、excludeAssetFilter、fetch、getPublicPath、getTemplate 外，增加了 prefetch 参数用于指定哪些是预加载的微应用。

  > 手动加载模式是单独提供预加载的 api，基于路由的不一样。

- 类型

  - `Options`

    - prefetch - `boolean | 'all' | string[] | (( apps: RegistrableApp[] ) => { criticalAppNames: string[]; minorAppsName: string[] })` - 可选，是否开启预加载，默认为 `true`。

      配置为 `true` 则会在第一个微应用 mount 完成后开始预加载其他微应用的静态资源

      配置为 `'all'` 则主应用 `start` 后即开始预加载所有微应用静态资源

      配置为 `string[]` 则会在第一个微应用 mounted 后开始加载数组内的微应用资源

      配置为 `function` 则可完全自定义应用的资源加载时机 (首屏应用及次屏应用)

    - sandbox - 见[Configuration](#微应用的配置信息)
    - singular - 见[Configuration](#微应用的配置信息)。**基于路由模式下，默认值为 `true`**。
    - fetch - 见[Configuration](#微应用的配置信息)。
    - getPublicPath - 见[Configuration](#微应用的配置信息)。
    - getTemplate - 见[Configuration](#微应用的配置信息)。
    - excludeAssetFilter - 见[Configuration](#微应用的配置信息)。

- 用法

  启动微服务。

- 示例

  ```js
  import { start } from '@game/insight'

  start({
    prefetch: ['purehtml'] // 预加载 purehtml
  })
  ```

### setDefaultMountApp(appLink)

- 参数

  - appLink - `string` - 必选

- 用法

  设置主应用启动后默认进入的微应用。

- 示例

  ```js
  import { setDefaultMountApp } from '@game/insight'

  setDefaultMountApp('/homeApp')
  ```

## [addErrorHandler/removeErrorHandler](https://single-spa.js.org/docs/api#adderrorhandler)

## `addGlobalUncaughtErrorHandler(handler)`

- 参数

  - handler - `(...args: any[]) => void` - 必选

- 用法

  添加全局的未捕获异常处理器。

- 示例

  ```ts
  import { addGlobalUncaughtErrorHandler } from '@game/insight'

  addGlobalUncaughtErrorHandler(event => console.log(event))
  ```

## `removeGlobalUncaughtErrorHandler(handler)`

- 参数

  - handler - `(...args: any[]) => void` - 必选

- 用法

  移除全局的未捕获异常处理器。

- 示例

  ```ts
  import { removeGlobalUncaughtErrorHandler } from '@game/insight'

  removeGlobalUncaughtErrorHandler(handler)
  ```

## `initGlobalState(state)`

- 参数

  - state - `Record<string, any>` - 必选

- 用法

  定义全局状态，并返回通信方法，建议在主应用使用，微应用通过 props 获取通信方法。

- 返回

  - MicroAppStateActions

    - onGlobalStateChange: `(callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void`， 在当前应用监听全局状态，有变更触发 callback，fireImmediately = true 立即触发 callback

    - setGlobalState: `(state: Record<string, any>) => boolean`， 按一级属性设置全局状态，微应用中只能修改已存在的一级属性

    - offGlobalStateChange: `() => boolean`，移除当前应用的状态监听，微应用 umount 时会默认调用

- 示例

  主应用：

  ```ts
  import { initGlobalState, MicroAppStateActions } from '@game/insight'

  // 初始化 state
  const actions: MicroAppStateActions = initGlobalState(state)

  actions.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev)
  })
  actions.setGlobalState(state)
  actions.offGlobalStateChange()
  ```

  微应用：

  ```ts
  // 从生命周期 mount 中获取通信方法，使用方式和 master 一致
  export function mount(props) {
    props.onGlobalStateChange((state, prev) => {
      // state: 变更后的状态; prev 变更前的状态
      console.log(state, prev)
    })

    props.setGlobalState(state)
  }
  ```
