const axios = require("axios");
const ProgressBar = require('progress');
const utils = require('./utils')
const safe = require("colors-cli/safe");

module.exports = {
  // 读取yapi生成mocks数据
  creatMocksAll(yapiConfig) {
    const postArr = [];
    (yapiConfig.projects || []).forEach((item,index) => {
      let origin = item.origin || yapiConfig.origin;
      if (origin.substr(origin.length - 1) === "/") {
        // 删除origin最后的一个 /
        origin = origin.substr(0, origin.length - 1);
      }
      postArr.push(
        this.getMocksSingle(
          {
            ...item,
            origin
          },
          yapiConfig,
          index
        )
      );
    });
    return new Promise((resolve) => {
      if (postArr.length > 0) {
        axios.all(postArr)
          .then(arr => {
            resolve(Object.assign(...arr))
          })
      } else {
        resolve({});
      }
    })
  },
  // 读取yapi生成mocks数据 -- 单个项目
  getMocksSingle(item, yapiConfig, projectIndex) {
    return new Promise(resolve => {
      axios.get(
          `${item.origin}/api/interface/list_menu?project_id=${item.id ||
          ""}&token=${item.token || ""}`
        )
        .then(async res => {
          if(res.data.errcode === 0) {
            let mockObj = {};
            const arr = res.data.data;

            let dataLen = 0
            for (const i in arr) {
              for (const j in arr[i].list) {
                dataLen += 1
              }
            }
            const bar = new ProgressBar(
              `${safe.green_b.black(" Yapi config loading: ")} project[${projectIndex}]:${item.id} group length:${arr.length} progress: :current/:total :percent`, {
                width: 20,
                total: dataLen
              });

            for (const i in arr) {
              for (const j in arr[i].list) {
                const apiId = arr[i].list[j]._id;
                const curMock = await this.getApiDetail(apiId, item, yapiConfig);
                mockObj[curMock.methodPath] = curMock.objData;
                bar.tick(1);
              }
            }
            resolve(mockObj)
          } else {
            resolve({})

            if(!item.token) {
              throw new Error(safe.red(`Yapi projects[${projectIndex}].token is not defined`))
            }
            if(!item.id) {
              throw new Error(safe.red(`Yapi projects[${projectIndex}].id is not defined`))
            } else {
              throw new Error(safe.red(`Yapi projects[${projectIndex}].id: ${item.id} error， Tips：${res.data.errmsg}`))
            }
          }
        })
        .catch((err) => {
          console.error(err)
          resolve({})
        })
    })
  },
  // 获取单个api详情
  getApiDetail(apiId, item, yapiConfig) {
    return axios
      .get(
        `${item.origin}/api/interface/get?id=${apiId ||
          ""}&token=${item.token || ""}`
      )
      .then(res => {
        const yapiData = res.data.data || {};
        const mockPath = `${yapiData.method} ${item.prefix}${yapiData.query_path.path}`;
        let bodyProperties = {}
        try {
          bodyProperties = JSON.parse(yapiData.res_body).properties
        } catch(err) {}
        const resBody = this.handleMock(bodyProperties);

        // function changeData(reqCode, res) {
        //   const arr = reqCode.split("|");
        //   arr.forEach(item => {
        //     if (resBody.hasOwnProperty(item)) {
        //       resBody[item] = res;
        //     }
        //   });
        // }
        // changeData("code|returncode", 10000);
        return {
          methodPath: mockPath,
          objData: {
            // status: 200,
            mockData: utils.mergeRecursive(resBody, yapiConfig.response)
          }
        };
      });
  },
  // 处理数据类型
  handleMock(obj) {
    let data = {};
    for (const key in obj) {
      const item = obj[key];
      if (item.mock && item.mock.mock) {
        data[key] = item.mock.mock;
      } else if (item.type === "object") {
        data[key] = this.handleMock(item.properties);
      } else if (item.type === "array") {
        data[key + '|10'] = [this.handleMock(item.items.properties)];
      } else if (item.type === "string") {
        data[key] = "@csentence(2, 30)";
      } else if (item.type === "integer" || item.type === "number") {
        data[key] = "@natural(1,100000)";
      } else if (item.type === "boolean") {
        data[key] = "@boolean";
      }
    }
    return data;
  }
};
