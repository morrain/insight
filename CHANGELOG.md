# Changelog

所有项目的变更记录会记录在如下文件.

### [1.5.1](https://gitlab.vmic.xyz///compare/v1.5.0...v1.5.1) (2021-02-02)


### Bug Fixes

* 修复Object.entries在低版本不能用的问题 ([35690e7](https://gitlab.vmic.xyz///commit/35690e7a435f4ce19240cdcdaf264065b0dce21a))

## [1.5.0](https://gitlab.vmic.xyz///compare/v1.4.1...v1.5.0) (2021-01-22)


### Features

* 升级@game/docs-config ([36a0f5a](https://gitlab.vmic.xyz///commit/36a0f5a06f5ce1b05381e2ea847e77271b16f557))
* 完善demo,更新logo ([2e1d321](https://gitlab.vmic.xyz///commit/2e1d3217a3887fcf11f76a6d04371b728dbcb5ee))
* 更新文档 ([919a97b](https://gitlab.vmic.xyz///commit/919a97b45c73b7b7d6fb210549532246bef02027))


### Bug Fixes

* 修复webhook.js脚本 ([3553213](https://gitlab.vmic.xyz///commit/35532137e85a86f85146174496f83bbfe45fda72))
* 增加webhook命令 ([2736464](https://gitlab.vmic.xyz///commit/27364643f5e20ef9c458b1d322c6b944a6fe9d26))
* 拼写错误 ([dcabb29](https://gitlab.vmic.xyz///commit/dcabb291c63cad0ba80575e1c22f252d3117f98a))

### [1.4.1](https://gitlab.vmic.xyz///compare/v1.4.0...v1.4.1) (2021-01-13)


### Bug Fixes

* 修复android 5下,object.values的兼容性问题 ([de73b58](https://gitlab.vmic.xyz///commit/de73b58abbc1c698d9b5f55e5c9f8d6de3d6485c))

## [1.4.0](https://gitlab.vmic.xyz///compare/v1.3.0...v1.4.0) (2020-12-29)


### Features

* 增加 setGlobalFunction ,解决在沙箱模式下,无法在全局window上添加函数的问题 ([e190f98](https://gitlab.vmic.xyz///commit/e190f98076086c0c13a447f5c281316708e2844e))
* 增加卡片的demo为多实例,并且开启沙箱 ([97b505d](https://gitlab.vmic.xyz///commit/97b505d6d525c144710f33ca4852740c34d96cd7))


### Bug Fixes

* 修复手动加载模式下,参数与路由模式混在一起的问题 ([32e4276](https://gitlab.vmic.xyz///commit/32e4276356dc75efab97f58af2be71bb62194b91))
* 修改settings.json配置,解决保存时卡死,不能自动修复代码格式的问题 ([4f7d0ed](https://gitlab.vmic.xyz///commit/4f7d0ed70404b0d2d569078e7e1b4521641c254a))
* 删除并忽略掉docs下的changelog文件,因为它是构建文档时从根目录拷贝过来的,不纳入git管理 ([04ffe02](https://gitlab.vmic.xyz///commit/04ffe028c6ae9f177d3615fa7246b43be277c9d3))
* 增加对 window.fetch的适配,解决安卓5环境下window.fetch没有的问题 ([71cef40](https://gitlab.vmic.xyz///commit/71cef40c763737b440c951b7effa9e61a8350f1a))

## [1.3.0](https://gitlab.vmic.xyz///compare/v1.2.0...v1.3.0) (2020-12-07)


### Features

* 添加文档服务器 ([b118142](https://gitlab.vmic.xyz///commit/b1181422328dbcc7f0b1874febe1d54a7bd49241))


### Bug Fixes

* 修改文档服务的端口号 ([3fa0bba](https://gitlab.vmic.xyz///commit/3fa0bba3e64014c14b43cb00f43e9cf6953fd245))

## [1.2.0](https://gitlab.vmic.xyz///compare/v1.1.0...v1.2.0) (2020-12-07)


### Features

* 1. 完善insight api文档 2. 丰富手动加载微应用的demo,增加update机制 ([e2c14a7](https://gitlab.vmic.xyz///commit/e2c14a7614ae46215e72c0a21c02060e50faf824))
* 优化文档的changelog文件 ([9ab9282](https://gitlab.vmic.xyz///commit/9ab9282c6b2fed66717b12ffd0356a11742f0c1f))
* 修改sourcemap的模式,方便调试源码 ([aac83f8](https://gitlab.vmic.xyz///commit/aac83f811a6895cd1c7b9fcf8f0f3b2045f1553d))
* 去掉集成的game-card demo ([2c8c84c](https://gitlab.vmic.xyz///commit/2c8c84c8dc92b3e9883e16e89af463caa6f4898a))
* 增加getAppStatus api接口 ([dd9d86e](https://gitlab.vmic.xyz///commit/dd9d86e772af6dad649015803db9e314b86b3760))
* 完善demo,完善api说明 ([0a21e13](https://gitlab.vmic.xyz///commit/0a21e134ef6e5f5e706091795d2a367c1450fb17))
* 完成手动加载,并且更新的demo ([79c2c6e](https://gitlab.vmic.xyz///commit/79c2c6e95d79042eac6819ef32e8ffc9db09c3c0))
* 打包工具修改完成,删除构建目录 es lib,并忽略 ([e4fdde5](https://gitlab.vmic.xyz///commit/e4fdde54cdaa7c2bbd6abb4b96c2b6d98f65abcf))
* 调整游戏卡片demo的样式 ([d22b3e7](https://gitlab.vmic.xyz///commit/d22b3e71b8cc00a8960ceb84d6ad654527cafabd))
* 集成 game-card demo. 使用git仓库引入 ([052c4d9](https://gitlab.vmic.xyz///commit/052c4d9355b67552120a3c8eef6eebc4b2c75b89))


### Bug Fixes

* 打包工具修改完成,删除构建目录 es lib,并忽略 ([1c4f328](https://gitlab.vmic.xyz///commit/1c4f3289f37e677229cc29650976bd8eeff628c0))
* 提交demo的lock文件 ([d760eca](https://gitlab.vmic.xyz///commit/d760eca19c6727ab55f19b67198f00f60c9855a2))
* 更新卡片demo ([44c8d7c](https://gitlab.vmic.xyz///commit/44c8d7c1ba1de777623efbd1b43e01acf005982f))
* 构建前清空es目录,避免调试时的map文件被发布到npm ([87bf63a](https://gitlab.vmic.xyz///commit/87bf63a5586108edab2a0ffde5ed7bb72d14e718))
* 避免不必要clone ([8981b18](https://gitlab.vmic.xyz///commit/8981b181e6c7fb9397dd028b07b3257c63b35c72))

## [1.1.0](https://gitlab.vmic.xyz///compare/v1.0.0...v1.1.0) (2020-12-01)


### Features

* 把编译后的文件暂时纳入git管理,优化打包脚本,好比对变化 ([7415983](https://gitlab.vmic.xyz///commit/7415983b84d022b08f1b5c62c6fd4758ce797ed0))
* 演示工程增加 默认打开演示demo的功能 ([fe47ae7](https://gitlab.vmic.xyz///commit/fe47ae7ece171b3471413bc81a234feaed23cc55))
* 调整打包方式,去掉father-build,使用babel打包,增加sourcemap功能,方便调试 ([44b375c](https://gitlab.vmic.xyz///commit/44b375c9e6535e0143fe3a171ac890a72bc163b0))


### Bug Fixes

* demo/vue3少了一个less模块 ([964f174](https://gitlab.vmic.xyz///commit/964f174420d7a093d3389268a70f5469b40469fa))
* 修复类型报错 ([d89ce7e](https://gitlab.vmic.xyz///commit/d89ce7e78f1dfebfac1453c58273b86906be3ed4))
* 删除一些貌似对构建不影响的配置 ([322296f](https://gitlab.vmic.xyz///commit/322296f3a0f3c5df9f4ade2c038dd82317033d2c))

## 1.0.0 (2020-11-17)


### Features

* 先提交一个初始版本 ([8a7f52a](https://gitlab.vmic.xyz///commit/8a7f52ad4fcbd990d226be290411d89e6123f958))


### Bug Fixes

* 不应该忽略package-lock.json ([f90b72b](https://gitlab.vmic.xyz///commit/f90b72bbfce4212ada08255a210f9d72c79732c5))
