module.exports = {
  'POST /mock-middleware/yapiMockApi/merge': {
    tesing: 'a',
    testcase: {
      a: {
        body: {
          string: '我也是',
          object: {
            objectKey: '我也是',
          },
          'data|3': [
            {
              string: '我是本地mock的',
            },
          ],
        },
      },
    },
  },
}
