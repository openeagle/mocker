const path = require('path')

module.exports = {
  local: path.resolve(__dirname, './mocker'), // 本地路径的mock文件目录
  // proxy: {}, // 使用 http-proxy-middleware 处理
  yapi: {
    origin: 'http://api.openeagle.cn/', // yapi对应的源地址
    response: {
      returncode: 10000,
      message: '请求成功',
      // body: {
      //   'data|30': [],
      // },
    },
    projects: [
      {
        id: '1305', // yapi的项目id
        token:
          '7bb6917466a6e0e2f0eaa5e859296aff61d285499eb0e65a8d7e76316cc08891',
        // origin: 'http://api.openeagle.cn/',
        prefix: '/mock-middleware', // 请求前缀
        proxy: 'http://api.openeagle.cn/mock/1249',
        // response: {
        //   code: 10000,
        //   message: '请求成功222',
        // },
      },
    ],
  },
}
