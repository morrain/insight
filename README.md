# inSight(洞见)

**见微知著，你需要洞见**

**更懂你的微前端解决方案**

inSight 是基于 [single-spa](https://github.com/CanopyTax/single-spa) 和 [qiankun](https://qiankun.umijs.org/zh) 的微前端解决方案，增加了 xxx(现在版本还没有做逻辑修改，后续有增加逻辑的需求)

## 安装 & 使用

```
npm i @game/insight -S
```

使用文档详见：

## 调试

克隆仓库到本地，根目录下的 demo 文件夹包括了微服务集成的 demo。可以直接运行和调试。操作步骤如下：

1. 安装构建 insight 的依赖

```
npm i
```

2. 安装构建 demo 的依赖

```
npm run demo:install     // npm-run-all --serial build install:*
```

该命里会先构建 insight 到本地的 es（es module）和 lib (commonjs)目录，然后逐一安装 demo 中的依赖

3. 启动 demo

```
npm run demo:start      // npm-run-all --parallel start:*
```

因为加载的微服务 demo 都要启动一个服务，所以这里使用串行模式，保证所有 demo 的微服务都被启动。因为是串行的，所以启动服务的先顺序不确定，启动后要访问主工程[http://localhost:7099](http://localhost:7099)来查看演示 demo。

> 主工程配置见 demo/main/webpack.config.js
