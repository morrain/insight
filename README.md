# inSight(洞见)

**见微知著，你需要洞见**

**VIVO 自己的微前端解决方案**

inSight 是基于 [single-spa](https://github.com/CanopyTax/single-spa) 和 [qiankun](https://qiankun.umijs.org/zh) 的微前端解决方案，增加了微应用管理和数据统计的功能，优化了包加载机制，依赖的包体大小更小。改变了打包方式，增加 sourcemap，方便开发调试。也修复了 qiankun 中部分 api 文档不准的问题，手动加载的微应用增加生命周期钩子。增加了获取微服务状态的 api 接口

更多需求后续逐步根据需要增加。

## 安装 & 使用

```
npm i @game/insight -S
```

使用文档详见：docs 目录

## 调试

克隆仓库到本地，根目录下的 demo 文件夹包括了微服务集成的 demo。可以直接运行和调试。操作步骤如下：

1. 安装构建 insight 的依赖

```
npm i
```

2. 安装构建 demo 的依赖

```
npm run demo:install     // npm-run-all --serial build:esm:dev install:*
```

该命里会先构建 insight 开发版本到本地的 es（es module）目录，会生成 sourcemap，调试 demo 更加方便。然后逐一安装 demo 中的依赖

3. 启动 demo

```
npm run demo:start      // npm-run-all --parallel start:*
```

启动后会打开 demo 主工程[http://localhost:7099](http://localhost:7099)的浏览器窗口，可以查看演示 demo。

> 主工程配置见 demo/main/webpack.config.js

## 工程介绍

### 目录结构

```
insight
┣ .vscode                            // 工程配置文件
┃ ┣ extensions.json                  //
┃ ┗ settings.json                    //
┣ docs                               // 洞见的文档
┃ ┣ .vuepress
┃ ┃ ┗ config.js
┃ ┣ api
┃ ┃ ┗ README.md
┃ ┣ faq
┃ ┃ ┗ README.md
┃ ┣ guide
┃ ┃ ┣ README.md
┃ ┃ ┗ getting-started.md
┃ ┗ README.md
┣ es                                 // 项目发布的 esm 版本代码，对应package.json 中的 module 字段
┣ lib                                // 项目发布的 cjs 版本代码，对应package.json 中的 main 字段
┣ src                                // 项目的源码
┃ ┣ addons
┃ ┃ ┣ engineFlag.ts
┃ ┃ ┣ index.ts
┃ ┃ ┗ runtimePublicPath.ts
┃ ┣ import-html-entry
┃ ┃ ┣ index.d.ts
┃ ┃ ┣ index.js
┃ ┃ ┣ process-tpl.js
┃ ┃ ┗ utils.js
┃ ┣ sandbox
┃ ┃ ┣ legacy
┃ ┃ ┃ ┗ sandbox.ts
┃ ┃ ┣ patchers
┃ ┃ ┃ ┣ dynamicAppend
┃ ┃ ┃ ┃ ┣ common.ts
┃ ┃ ┃ ┃ ┣ forLooseSandbox.ts
┃ ┃ ┃ ┃ ┣ forStrictSandbox.ts
┃ ┃ ┃ ┃ ┗ index.ts
┃ ┃ ┃ ┣ css.ts
┃ ┃ ┃ ┣ historyListener.ts
┃ ┃ ┃ ┣ index.ts
┃ ┃ ┃ ┣ interval.ts
┃ ┃ ┃ ┗ windowListener.ts
┃ ┃ ┣ common.ts
┃ ┃ ┣ index.ts
┃ ┃ ┣ proxySandbox.ts
┃ ┃ ┗ snapshotSandbox.ts
┃ ┣ apis.ts
┃ ┣ effects.ts
┃ ┣ errorHandler.ts
┃ ┣ globalState.ts
┃ ┣ index.ts
┃ ┣ interfaces.ts
┃ ┣ loader.ts
┃ ┣ prefetch.ts
┃ ┗ utils.ts
┣ .eslint-config.js                 // eslint 的配置文件
┣ .eslintignore                     // eslint 忽略文件
┣ .eslintrc.js                      // eslint 的配置文件
┣ .gitignore                        // git 忽略文件
┣ .prettierrc.js                    // 格式化配置文件
┣ CHANGELOG.md                      // 版本记录文件
┣ README.md                         // 工程介绍文档
┣ babel.config.js                   // babel 的配置文件
┣ commitlint.config.js              // 提交代码校验功能的配置文件
┣ package-lock.json
┣ package.json
┗ tsconfig.json                     // ts 的配置文件
```

### 工程规范

本项目使用 [https://gitlab.vmic.xyz/game-common/specification](https://gitlab.vmic.xyz/game-common/specification)中的规范

集成了，eslint 检查、提交校验、提交日志、代码格式化等等功能

**请使用 `npm run commit` 提交代码**

### 命令说明

```json
 "scripts": {
    "demo:install": "npm-run-all --serial build:esm:dev install:*",
    "demo:start": "npm-run-all --parallel start:*",
    "install:main": "cd demo/main && npm i",
    "start:main": "cd demo/main && npm run start",
    "install:vue": "cd demo/vue && npm i",
    "start:vue": "cd demo/vue && npm start",
    "install:purehtml": "cd demo/purehtml && npm i",
    "start:purehtml": "cd demo/purehtml && npm start",
    "install:vue3": "cd demo/vue3 && npm i",
    "start:vue3": "cd demo/vue3 && npm start",
    "build:esm": "rm -rf es && cross-env NODE_ENV=esm babel src --out-dir es --extensions .ts,.js && tsc",
    "build:esm:dev": "cross-env NODE_ENV=esm babel src --out-dir es --extensions .ts,.js --source-maps",
    "build:cjs": "cross-env NODE_ENV=cjs babel src --out-dir lib --extensions .ts,.js",
    "docs:dev": "cp CHANGELOG.md docs/CHANGELOG.md && vuepress dev docs",
    "docs:build": "cp CHANGELOG.md docs/CHANGELOG.md && vuepress build docs",
    "release:pre": "npm run build:esm && npm run build:cjs && (HUSKY_SKIP_HOOKS=1 standard-version)",
    "release": "npm run build:esm && npm run build:cjs && (HUSKY_SKIP_HOOKS=1 standard-version  --dry-run=false) && npm publish",
    "test": "echo \"Error: no test specified\" && exit 1",
    "commit": "cz"
  }
```

1. demo:install

   构建用于开发调试 esm 版本，然后安装 demo 中微服务的依赖

2. demo:start

   逐一启动 demo，会自动打开浏览器显示 demo 内容，方便调试

3. build:esm

   生成用于发布的 esm 版本。release 中使用

4. build:esm:dev

   生成用于调试的 esm 版本。启动 demo 调试时使用

5. build:cjs

   生成用于发布的 cjs 版本。release 中使用

6. docs:dev

   开发文档。把根目录下的 CHANGELOG.md 文件拷贝到文档目录

7. docs:build

   生成文档。把根目录下的 CHANGELOG.md 文件拷贝到文档目录

8. release:pre

   预发布，会生成发布的版本，然后在控制台显示版本变动信息。实际不会执行发布操作

9. release

   发布，会生成发布的版本，同时更新版本信息，最后执行 npm publish 发布到 npm. **请务必使用预发布确认版本信息后才发布**

10. commit

    提交代码
