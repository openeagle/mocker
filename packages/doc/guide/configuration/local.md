
# 本地自定义模拟数据

## 配置本地目录

```js
const path = require('path')
const createHTTPMockMiddleware = require('@openeagle/http-mock-middleware');

createHTTPMockMiddleware({
  local: path.resolve(__dirname, 'mock'), // 设置本地 mock 文件目录
})
```

## 配置模拟数据

按服务端的接口路径结构在本地 mock 目录里配置对应接口模拟数据。

```
.
├── ...
├── mock ####################################### 接口模拟配置
│   ├── xxx #################################### https://xxx-api.openeagle.cn
│   │   ├── member ############################# 会员业务
│   │   │   ├── config ######################### 配置模块
│   │   │   │   ├── list ####################### 配置列表
│   │   │   │   └── query ###################### 配置查询
│   │   │   ├── order ########################## 会员订单
│   │   │   └── ... ############################ 其他模块
│   │   └── user ############################### 用户服务
│   ├── yyy #################################### https://yyy-api.openeagle.cn
│   └── zzz #################################### https://zzz-api.openeagle.cn
├── src
└── ...
```

每个模块的导出如下所示:

```js
module.exports = {
  'POST /api/xxx/member/order/list': {
    response: {
      code: '10000',
      message: 'success',
      body: {
        hasMore: true,
        'data|10': [{
          'id|+1': 1,
        }],
      },
    },
  },
}
```
