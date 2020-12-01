# Changelog

所有项目的变更记录会记录在如下文件.

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
