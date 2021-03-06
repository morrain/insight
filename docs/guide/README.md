# 介绍

**见微知著，你需要洞见**

**VIVO 自己的微前端解决方案**

inSight 是基于 [single-spa](https://github.com/CanopyTax/single-spa) 和 [qiankun](https://qiankun.umijs.org/zh) 的微前端解决方案

## 什么是微前端

微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略。

> Techniques, strategies and recipes for building a **modern web app** with **multiple teams** that can **ship features independently**. -- [micro-frontends](https://micro-frontends.org/)

微前端的概念最早出现于 2016 年，是微服务概念向前端领域延伸，出处于[thoughtworks](https://www.thoughtworks.com/radar/techniques/micro-frontends)

微前端架构旨在解决单体应用在一个相对长的时间跨度下，由于参与的人员、团队的增多、变迁，从一个普通应用演变成一个巨石应用([Frontend Monolith](https://www.youtube.com/watch?v=pU1gXA0rfwc))后，随之而来的应用不可维护的问题。这类问题在企业级 Web 应用中尤其常见。

所以微前端的核心思想就是**将一个 web 应用拆分成不同功能模块的组合，不同功能模块由不同的团队维护，独立开发独立部署，还能获得产品完整的一致性体验。**

如下图所示，一个商店应用的框架图，在服务端微服务演进中，服务端逐步变成一个一个的微服务，独立开发独立部署，而前端逐步演变成一个巨石应用，整个项目变得庞大，整个项目由一个前端团队协作完成，协作和维护成本逐步变高。

![](../assets/monolith.png)

而把微服务的概念引入到前端领域后，把整个前端应用拆成不同的功能组合，不同的功能单元由不同的前端团队负责开发、维护、发布。如下图所示：

![](../assets/microfrontend.png)

使用微服务架构后具备如下优势：

- **复杂度可控**: 每一个 UI 业务模块由独立的前端团队开发，避免代码巨无霸，保持开发时的高速编译，保持较低的复杂度，便于维护与提高开发效率。
- **独立部署**: 每一个模块可单独部署，颗粒度可小到单个组件的 UI 独立部署，不对其他模块有任何影响。
- **技术选型灵活**: 也是最具吸引力的，在同一项目下可以使用如今市面上所有前端技术栈，也包括未来的前端技术栈。
- **容错**: 单个模块发生错误，不影响全局。
- **扩展**: 每一个服务可以独立横向扩展以满足业务伸缩性，与资源的不必要消耗。

## 我们何时需要微前端

1. 业务模块复用度高，出现在很多业务当中，但却包括业务逻辑和服务，通过组件复用不合适。
2. 项目过于庞大，代码编译慢，任意改动需要全项目发布，开发体差，需要一种更高维度的解耦方案。
3. 单一技术栈无法满足你的业务需求。
4. 项目技术栈过于老旧，相关技能的开发人员少，功能扩展吃力，重构成本、维护成本高。
   > 随着时间的推移，团队人员的流动，会慢慢发现一些事情：比如原维护团队以 vue3 的视角看 vue2 的世界，就像在看原始人用原始的姿势拉着原始的屎，又或者新人进来以 react 看 vue，鸡同鸭讲理念不同。 微前端的理想状态也许就是用最爽的姿势写最新的业务模块吧。

如下图所示，整个页面由三个独立的团队完成，蓝色框中由 Checkout 业务团队负责开发和维护，绿色框中由 Inspire 业务团队负责开发和维护，红色框中由 Product 业务团队开发和维护，并完成对 CheckOut 和 Inspire 业务的接入。不同团队之间可以使用不同的技术栈。

![](../assets/three-teams.png)

[浏览器中打开上图示例](https://micro-frontends.org/1-composition-client-only/)

## 面临的问题与挑战

1. 我们如何实现在一个页面里渲染多种技术栈?
2. 不同技术栈的独立模块之间如何通讯?
3. 如何通过路由渲染到正确的模块?
4. 在不同技术栈之间的路由该如何正确触发?
5. 项目代码别切割之后，通过何种方式合并到一起?
6. 我们的每一个模块项目如何打包?
7. 前端微服务化后我们该如何编写我们的代码?
8. 独立团队之间该如何协作?

更多关于微前端的相关介绍，推荐大家可以去看这几篇文章：

- [Micro Frontends](https://micro-frontends.org/)
- [可能是你见过最完善的微前端解决方案](https://zhuanlan.zhihu.com/p/78362028)
- [微前端的核心价值](https://zhuanlan.zhihu.com/p/95085796)

## 为什么不是 iframe

如果不考虑体验问题，iframe 几乎是最完美的微前端解决方案了。

iframe 最大的特性就是提供了浏览器原生的硬隔离方案，不论是样式隔离、js 隔离这类问题统统都能被完美解决。但他的最大问题也在于他的隔离性无法被突破，导致应用间上下文无法被共享，随之带来的开发体验、产品体验的问题。

1. url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
2. UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..
3. 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。
4. 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

其中有的问题比较好解决(问题 1)，有的问题我们可以睁一只眼闭一只眼(问题 4)，但有的问题我们则很难解决(问题 3)甚至无法解决(问题 2)，而这些无法解决的问题恰恰又会给产品带来非常严重的体验问题。

## 特性

- 🍗 **增加`setGlobalFunction`等更多 api**，支持在沙箱模式下往全局 window 上挂载函数。
- 📦 **基于 [single-spa](https://github.com/CanopyTax/single-spa)** 封装，提供了更加开箱即用的 API。
- 📱 **技术栈无关**，任意技术栈的应用均可 使用/接入，不论是 React/Vue/Angular/JQuery 还是其他等框架。
- 💪 **HTML Entry 接入方式**，让你接入微应用像使用 iframe 一样简单。
- 🛡​ **样式隔离**，确保微应用之间样式互相不干扰。
- 🧳 **JS 沙箱**，确保微应用之间 全局变量/事件 不冲突。
- ⚡️ **资源预加载**，在浏览器空闲时间预加载未打开的微应用资源，加速微应用打开速度。
