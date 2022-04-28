const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const Mock = require("mockjs");
const utils = require("./utils");
const yapiUtls = require("./yapi");

function createHTTPMockMiddleware(opts) {
  const defaultOptions = {
    localTigNore: "./utils", // 忽略的目录
    delay: 100, // 延迟
    mergeable: true, // 是否合并yapi生成的mock数据
    yapi: {
      // params: {
      //   pageNumber: "page_no|pageNum|page_num|pageNo",
      //   pageSize: "page_size|pageSize",
      //   code: "code|returncode",
      //   message: "message"
      // }, // 全局定义一些分页大小
      // // 定义全局的响应格式
      // response: {
      //   code: 10000,
      //   message: "请求成功"
      // },
    },
  };
  const options = utils.mergeRecursive(defaultOptions, opts);

  let mockMerge = {}; // 所有mock数据
  let lacalMock = {}; // 本地mock数据
  let yapiAllMock = {}; // yapi生成的mock数据
  // 合并配置信息、权重-- (接口 > 统配)
  const getConfig = (config = {}, req) => {
    const defaultConfig = {
      delay: options.delay, // 默认 100
      // yapiPath: '', // yapi接口路径
      // proxy: '',
      disabled: false, // 是否禁用mock
      status: 200,
      mergeable: true, // 是否合并yapi生成的mock数据
      response: {},
      tesing: "", // 为字符串‘a’时，使用testcase ‘a’里的数据
      testcase: {}, // 多个场景的数据
      mockData: {}, // 处理完后的mock数据
    };

    const conRes = utils.mergeRecursive(defaultConfig, config); // 合并配置
    if (conRes.tesing && utils.typeOf(conRes.tesing) === "String") {
      conRes.mockData = conRes.testcase[conRes.tesing];
    }
    conRes.mockData = utils.mergeRecursive(conRes.response, conRes.mockData);
    return conRes;
  };

  const router = express.Router();
  router.use((req, res, next) => {
    req.path = (req.url || "").split("?")[0];
    next();
  });

  // 处理proxy路由
  const proxyList = (() => {
    const proxyObj = { ...options.proxy };
    // console.log('options', options)
    for (let item of options.yapi.projects || []) {
      if (item.prefix && item.proxy) {
        proxyObj[item.prefix] = item.proxy;
      }
    }
    return proxyObj;
  })();
  for (let key in proxyList) {
    const proxyPath = key;
    const proxyTaget = proxyList[key];
    const filter = (path, req) => {
      const key = `${req.method.toUpperCase()} ${path}`;
      if (mockMerge[key]) {
        const config = getConfig(mockMerge[key]); // 合并默认数据
        return config.disabled
      } else {
        return true;
      }
    };
    router.use(
      proxyPath,
      createProxyMiddleware(filter, {
        target: proxyTaget,
        changeOrigin: true,
        pathRewrite: {
          ["^" + proxyPath]: "",
        },
        logLevel: "warn",
      })
    );
  }

  // 注册中间件 - 处理req的数据
  router.use(express.json());

  // 获取所有yapi上的mock数据生成 [key: sting]: object
  yapiUtls.creatMocksAll(options.yapi).then((yapiMock) => {
    yapiAllMock = { ...yapiMock };
    // console.log("yapiAllMock", yapiAllMock);
    mockMerge = { ...yapiMock };
    if (options.local) {
      utils.wathFile(
        options.local,
        {
          ignored: new RegExp(options.localTigNore), // 多个文件夹以|分割，./comment|./node_modules
        },
        (lacalMockData) => {
          mockMerge = { ...yapiMock, ...lacalMockData };
          lacalMock = lacalMockData;
        }
      );
    }
  });

  // 处理mock路由
  router.all("/*", (req, res, next) => {
    const curTime = +new Date();
    const key = `${req.method.toUpperCase()} ${req.path}`;
    // console.log('处理mock路由', key, mockMerge[key])
    const value = mockMerge[key];
    if (value) {
      if (utils.typeOf(value) === "Function") {
        // console.log("timeout", new Date() - curTime);
        value(req, res, next);
      } else if (utils.typeOf(value) === "Object") {
        let config = getConfig(value, req); // 合并默认数据
        // console.log("config", JSON.stringify(config));
        if (config.disabled) {
          // next，以防止有页面路由，但是不会跳转的情况
          next();
        } else {
          let mockJson = config.mockData; // mock数据
          if (config.mergeable && lacalMock[key]) {
            // 需要合并yapi的mock数据、且本地存在
            if (yapiAllMock[key]) {
              // 有yapi接口
              mockJson = utils.mergeRecursive(
                yapiAllMock[key].mockData,
                config.mockData
              );
            } else {
              // 没有yapi接口
              mockJson = config.mockData;
            }
            // console.log("mockJson", mockJson);
          }
          // mockJson = mockMiddle(mockJson, config, req);
          const resData = Mock.mock(mockJson);
          let timeout = config.delay - (new Date() - curTime);
          setTimeout(
            () => {
              res.end(JSON.stringify(resData));
            },
            timeout > 0 ? timeout : 0
          );
        }
      }
    } else {
      next();
    }
  });

  return (req, res, next) => {
    router(req, res, next);
  };
}

module.exports = createHTTPMockMiddleware;
