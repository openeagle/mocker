# 介绍

## 背景

1. 无法同步开发：在与服务端联调接口前，只能开发静态页面，页面数据和页面逻辑只能写死在代码中；
2. 沟通成本较高：在开发业务逻辑的时候，需要频繁与服务端沟通修改数据库制造测试数据，中间可能遇到环境和开发人员没空的情况，延误开发进度；
3. 提测质量较差：在制造测试数据成本较高的情况下，开发人员很多时候会偷懒不去测试边界情况，导致提测问题较多，此外，在代码中写死测试数据容易误把测试数据提交到正式环境；

## 特性

> ⚠️ 可以独立[使用](/guide/usage.html)，而无需依赖 [webpack](https://github.com/webpack/webpack) 和 [webpack-dev-server](https://github.com/webpack/webpack-dev-server)。

1. 方便 -- 配置yapi接口文档直接生成对应mock数据
2. 基于[mockjs](http://mockjs.com/)，支持mockjs的所有语法
3. 支持热更新，修改、新增json文件，接口保存及时生效
4. 支持慢速网络模拟，方便前端测试
5. 支持针对不同业务场景切换不同mock数据
6. 无yapi文档的接口支持配置真实api
7. 自动读取 [config.local](/api/config) 参数 路径下的所有文件，无需统一入口文件
8. 本地mock接口重复冲突提示

## 竞品

- [Mokcer API](https://github.com/jaywcjlove/mocker-api)
- [vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock)

## 计划

- [ ] 支持更多的接口文档平台
- [ ] 开发 Chrome 开发者工具扩展，灵活切换多场景测试示例
- [ ] 基于 AI 自动生成多场景测试数据
