## Config


| 参数          | 说明                 | 类型                      | 默认 | 必传 |
| ------------- | -------------------- | ------------------------- | ---- | ---- |
| yapi    | yapi配置             | [YAPI](#YAPI) |      | 否 |
| local | 本地已有mock文件入口 | string                    |      | 否 |
| proxy         | 代理转发             | {[key: string]: string} |      | 否 |
| delay         | 请求返回时长         | number                    | 100 | 否 |

## YAPI

| 参数     | 说明                       | 类型                              | 必传 |
| -------- | -------------------------- | --------------------------------- | ---- |
| origin   | yapi对应的源地址           | string                            | 是   |
| response | 用于覆盖所有yapi返回的数据 | {[key: string]: any}           | 否   |
| projects | yapi项目配置               | [ProjectsType](#ProjectsType) | 是   |



## ProjectsType

| 参数     | 说明                        | 类型                    | 必传 |
| -------- | --------------------------- | ----------------------- | ---- |
| origin   | yapi对应的源地址           | string                            |可选|
| id       | yapi项目id                  | number                  | 是   |
| token    | yapi项目token               | string                  | 是   |
| prefix   | api访问前缀                 | string                  | 是   |
| response | 用于覆盖所有yapi返回的数据  | {[key: string]: any} | 否   |
| proxy    | 兜底api-没有mock数据走proxy | string                  | 否   |

