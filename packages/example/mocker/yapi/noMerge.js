module.exports = {
  'POST /mock-middleware/yapiMockApi/no_merge': {
    mergeable: false, // 不合并yapi生成的mock数据
    tesing: 'a',
    testcase: {
      a: {
        returncode: '10000',
        message: 'success',
        body: {
          string: '我也是',
          object: {
            objectKey: '我也是',
          },
          'data|4': [
            {
              string: '我是本地mock的',
            },
          ],
        },
      },
    },
  },
}
