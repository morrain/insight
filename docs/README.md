---
home: true
title: insight
heroText: 见微知著，你需要洞见
tagline: 可能是你见过最懂你的微前端解决方案
actionText: 快速上手 →
actionLink: /guide/
features:
  - title: 简单
    details: 任意 js 框架均可使用。微应用接入像使用接入一个 iframe 系统一样简单，但实际不是 iframe。
  - title: 完备
    details: 几乎包含所有构建微前端系统时所需要的基本能力，如 样式隔离、js 沙箱、预加载等。
  - title: 可用
    details: 从乾坤而来，经过线上项目考验，值得信赖
footer: MIT Licensed | Copyright © 2020-present Powered by game-fed
---

## 📦 安装

```shell
$ npm i insight -S
```

## 🔨 使用

```tsx
import { loadMicroApp } from 'insight'

// 加载微应用
loadMicroApp({
  name: 'vue',
  entry: '//localhost:7100',
  container: '#container',
  props: {
    slogan: 'Hello InSight'
  }
})
```

参考：[快速上手](/guide/)。
