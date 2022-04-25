## 参数说明

#### config


| 参数          | 说明                 | 类型                      | 默认 | 必传 |
| ------------- | -------------------- | ------------------------- | ---- | ---- |
| disabled | 是否禁用mock | boolean | false | 否 |
| mergeable | 是否合并yapi生成的mock数据 | boolean             | true | 否 |
| status | 请求状态码 | number | 200 | 否 |
| delay         | 请求返回时长         | number                    | 100 | 否 |
| response | 用于合并覆盖当前接口返回的数据 | {[key: string]: any}           | 否   ||
| tesing   | 与testcase配合使用，为testcase的key | string  |      |  |
| testcase | 测试场景的值，用于覆盖当前接口返回的数据，优先级高于response | {[key: string]: any} |  |  |

