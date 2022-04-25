module.exports = {
  'POST /mock-middleware/yapiMockApi/testcase_response': {
    response: {
      body: {
        boolean: 'response统一覆盖',
        integer: 'response统一覆盖',
      },
    },
    tesing: 'res3',
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
    },
  },
}
