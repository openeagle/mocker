# 安装

本文会帮助你从头搭建一个简单的 HTTP Mocker

## 安装依赖

```
npm install @openeagle/http-mock-middleware --save-dev
```
或者
```
yarn add @openeagle/http-mock-middleware --dev
```

## 框架集成

### Vue CLI

```js
// vue.config.js

const path = require('path')

module.exports = {
  devServer: {
    ...
    before(app){
      const createHTTPMockMiddleware = require('@openeagle/http-mock-middleware');
      app.use(createHTTPMockMiddleware({
        delay: 200, // 模拟接口统一设置 200ms 的延迟
        local: path.resolve(__dirname, 'mock'), // 设置本地 mock 文件目录
        yapi: {
          origin: 'http://yapi.openeagle.cn/',
          projects: [
            {
              id: '633', // YAPI 项目id
              token: 'xxxToken', // YAPI 项目token
              prefix: '/api/xxx', // 请求前缀
              proxy: 'http://xxx-api.openeagle.cn', // 反向代理
            },
          ],
        },
      }))
    }
  },
};
```

### Vite

```ts
// vite.config.ts

import * as path from 'path'
import { Plugin, defineConfig } from 'vite'
import createHTTPMockMiddleware from '@openeagle/http-mock-middleware'

const HTTPMockPlugin = (): Plugin => {
  let config: any
  return {
    name: 'http-mock',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    configureServer(server) {
      if (config && config.command === 'serve') {
        server.middlewares.use(
          createHTTPMockMiddleware({
            delay: 200, // 模拟接口统一设置 200ms 的延迟
            local: path.resolve(__dirname, 'mock'), // 设置本地 mock 文件目录
            yapi: {
              origin: 'http://yapi.openeagle.cn/',
              projects: [
                {
                  id: '633', // YAPI 项目id
                  token: 'xxxToken', // YAPI 项目token
                  prefix: '/api/xxx', // 请求前缀
                  proxy: 'http://xxx-api.openeagle.cn', // 反向代理
                },
              ],
            },
          })
        )
      }
    },
  }
}

export default defineConfig(({ command }) => {
  return {
    // ...
    plugins: [
      HTTPMockPlugin(),
    ],
  }
})
```

### Webpack

```js
// webpack.config.js

const path = require('path')

module.exports = {
  devServer: {
    // ...
    before(app){
      const createHTTPMockMiddleware = require('@openeagle/http-mock-middleware');
      app.use(createHTTPMockMiddleware({
        delay: 200, // 模拟接口统一设置 200ms 的延迟
        local: path.resolve(__dirname, 'mock'), // 设置本地 mock 文件目录
        yapi: {
          origin: 'http://yapi.openeagle.cn/',
          projects: [
            {
              id: '633', // YAPI 项目id
              token: 'xxxToken', // YAPI 项目token
              prefix: '/api/xxx', // 请求前缀
              proxy: 'http://xxx-api.openeagle.cn', // 反向代理
            },
          ],
        },
      }))
    }
  },
};
```

### Create React App

```js
// src/setupProxy.js
const path = require('path');

module.exports = function(app) {
   const createHTTPMockMiddleware = require('@openeagle/http-mock-middleware');
    app.use(createHTTPMockMiddleware({
      delay: 200, // 模拟接口统一设置 200ms 的延迟
      local: path.resolve(__dirname, 'mock'), // 设置本地 mock 文件目录
      yapi: {
        origin: 'http://yapi.openeagle.cn/',
        projects: [
          {
            id: '633', // YAPI 项目id
            token: 'xxxToken', // YAPI 项目token
            prefix: '/api/xxx', // 请求前缀
            proxy: 'http://xxx-api.openeagle.cn', // 反向代理
          },
        ],
      },
    }))
};
```

### Express

```js
const path = require('path');
const express = require('express');
const createHTTPMockMiddleware = require('@openeagle/http-mock-middleware');

const app = express();

app.use(createHTTPMockMiddleware({
  delay: 200, // 模拟接口统一设置 200ms 的延迟
  local: path.resolve(__dirname, 'mock'), // 设置本地 mock 文件目录
  yapi: {
    origin: 'http://yapi.openeagle.cn/',
    projects: [
      {
        id: '633', // YAPI 项目id
        token: 'xxxToken', // YAPI 项目token
        prefix: '/api/xxx', // 请求前缀
        proxy: 'http://xxx-api.openeagle.cn', // 反向代理
      },
    ],
  },
}))

app.listen(8080);
```

