---
home: true
title: insight
heroText: 见微知著，你需要洞见
tagline: VIVO自己的微前端解决方案
actionText: 快速上手 →
actionLink: /guide/getting-started
features:
  - title: 简单
    details: 子应用可使用任意 js 框架。接入子应用像接 iframe 一样简单，却能获取产品完整的一致性体验。
  - title: 完备
    details: 几乎包含所有构建微前端系统时所需要的基本能力，如 样式隔离、js 沙箱、预加载等。
  - title: 好用
    details: 打包优化，增加调试功能，开发效率更高。增加`setGlobalFunction`等更多api，支持在沙箱模式下往全局window上挂载函数。
footer: MIT Licensed | Copyright © 2020-present Powered by GAME-FED
---

## 📱 示例

::: center
![](./assets/demo.gif)
:::

## 📦 安装

```shell
$ npm i @game/insight -S
```

## 🔨 使用

```js
import { loadMicroApp } from '@game/insight'

// 加载微应用
const cardInstance = loadMicroApp(
  {
    name: 'gamecard',
    entry: '//game-card.vivo.com.cn:7104/game-card/', // 请去游戏卡片工程启动服务 https://gitlab.vmic.xyz/gamehelper/game-card
    container: '#gamecard-container',
    props: {
      reportData: {
        package_name: 'com.tencent.tmgp.sgame',
        dl_page: 'default'
      }
    }
  },
  null,
  {
    beforeLoad: [
      app => {
        console.log('[loadMicroApp][LifeCycle] before load %c%s', 'color: green;', app.name)
      }
    ],
    beforeMount: [
      app => {
        console.log('[loadMicroApp][LifeCycle] before mount %c%s', 'color: green;', app.name)
      }
    ],
    afterMount: [
      app => {
        console.log('[loadMicroApp][LifeCycle] after mount %c%s', 'color: green;', app.name)
      }
    ],
    beforeUnmount: [
      app => {
        console.log('[loadMicroApp][LifeCycle] before unmount %c%s', 'color: green;', app.name)
      }
    ],
    afterUnmount: [
      app => {
        console.log('[loadMicroApp][LifeCycle] after unmount %c%s', 'color: green;', app.name)
      }
    ]
  }
)
```

参考：[快速上手](/guide/getting-started)。
