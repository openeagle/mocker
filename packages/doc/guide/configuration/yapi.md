
# YAPI 接口模拟数据

## 获取 YAPI 信息

1. 项目 ID：访问 YAPI 项目 =》 设置 =》 项目配置 =》 拷贝“项目 ID”
2. 项目 Token：访问 YAPI 项目 =》 设置 =》 token 配置 =》 拷贝“token”


## 配置 YAPI 项目

```js
const path = require('path')
const createHTTPMockMiddleware = require('@openeagle/http-mock-middleware');

createHTTPMockMiddleware({
  yapi: {
    origin: 'http://yapi.openeagle.cn/',
    projects: [
      {
        id: '633', // YAPI 项目id
        token: 'xxxToken', // YAPI 项目token
        prefix: '/api/xxx', // 请求前缀
        proxy: 'http://xxx-api.openeagle.cn', // 反向代理，指向真实环境的接口地址
      },
    ],
  },
})
```
