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
    details: 从乾坤而来，经过线上项目考验。打包优化，增加调试功能，开发效率更高。补充更多api
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

参考：[快速上手](/guide/getting-started)。
