# webpack-plugin生成mock数据

#### 期望功能

1：支持多项目✔

2：多前缀配置✔（支持独立api、独立文件夹配置）

3：api做兜底✔

4：切换不同场景数据✔

5：支持本地合并生成的mock数据✔




#### 设计原则

| 数据形式 | 说明               | 优先级 | 禁用方式            |
| -------- | ------------------ | ------ | ------------------- |
| local    | 本地mock文件       | 1      | {disableMock: true} |
| yapi     | yapi生成的mock数据 | 2      | {disableMock: true} |
| server   | api的兜底          | 3      | 不传 proxy          |




#### 考虑

##### 1.mock数据生成方式

  ```
本地文件方式: {
    优点: 方便基于生成的mock修改
    缺点：1：本地文件需要维护
         2：第二次生成时会被覆盖
         3：本地合并生成的mock数据时还是需要生成一份express数据
}

express方式：{
    优点：不生成本地文件,
    缺点：不方便基于生成的mock修改(功能.5可优化)
}

综上所述：使用express方式
  ```

##### 2.使用

```
module.exports = {
  devServer: {
    ...
   before(app){
      const httpMockMiddleware = require('@openeagle/http-mock-middleware');
      httpMockMiddleware(app, {
        local: path.resolve(__dirname, './mocker'), // 本地路径的mock文件目录
        yapi: {
          origin: 'http://api.openeagle.cn/', // yapi对应的源地址
          response: {
            returncode: 10000,
            message: '请求成功',
          },
          projects: [
            {
              id: '633', // yapi的项目id
              token: '1f41d9e0f188ec7aaae786cd4663766f4d11fc8a65fbedf08af234234b3dbe90', // yapi的项目token
              prefix: '/dsp', // 请求前缀
            },
          ],
        },
      });
   }
  },
};
  ```

##### 3.数据格式


| 参数          | 说明                 | 类型                      | 默认 | 必传 |
| ------------- | -------------------- | ------------------------- | ---- | ---- |
| yapi    | yapi配置             | [yapiType](#yapiType类型) |      | 否 |
| local | 本地已有mock文件入口 | string                    |      | 否 |
| proxy         | 代理转发             | {[key: string]: string} |      | 否 |
| delay         | 请求返回时长         | number                    | 100 | 否 |



#### yapiType类型

| 参数     | 说明                       | 类型                              | 必传 |
| -------- | -------------------------- | --------------------------------- | ---- |
| origin   | yapi对应的源地址           | string                            | 是   |
| response | 用于覆盖所有yapi返回的数据 | {[key: string]: any}           | 否   |
| projects | yapi项目配置               | [projectsType](#projectsType类型) | 是   |



#### projectsType类型

| 参数     | 说明                        | 类型                    | 必传 |
| -------- | --------------------------- | ----------------------- | ---- |
| origin   | yapi对应的源地址           | string                            |可选|
| id       | yapi项目id                  | number                  | 是   |
| token    | yapi项目token               | string                  | 是   |
| prefix   | api访问前缀                 | string                  | 是   |
| response | 用于覆盖所有yapi返回的数据  | {[key: string]: any} | 否   |
| proxy    | 兜底api-没有mock数据走proxy | string                  | 否   |




##### 4.本地Mock合并

```
// method   完整路径
  'POST /api/member/proxy/auth/registerr': {
    delay: 1200,
    disabled: true, // 是否禁用mock
    mergeable: true, // 是否合并yapi生成的mock数据
    response: { // 用于合并覆盖当前接口返回的数据
      message: '请求成功',
    },
    tesing: 'a', // 手动mock数据  使用scenes ‘a’里的数据
    tesing: 'res1',
    testcase: {
      res1: {
        body: {
          string: '多场景数据1',
          number: '多场景数据1',
        },
      },
      res2: {
        body: {
          string: '多场景数据2',
          number: '多场景数据2',
        },
      },
      res3: {
        body: {
          string: '多场景数据3',
          number: '多场景数据3',
        },
      },
    }
  }
```
