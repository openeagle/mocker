const Mock = require('mockjs')

module.exports = {
  'POST /mock-middleware/localMockApi': (req, res) => {
    setTimeout(() => {
      res.json(
        Mock.mock({
          returncode: '10000',
          message: 'success',
          body: {
            'data|10': [
              {
                dateDay: '@datetime',
                'show|1000-20000': 20000,
                'click|1000-20000': 20000,
                'expense|1000-20000': 20000,
                'groupId|+1': 1,
                groupName: '@ctitle(4,10)',
                planName: '@ctitle(4,10)',
                priceSpaceName: '校园信息流首位',
                'schoolCount|100-1000': 1000,
                'studentCount|100-1000': 1000,
                'parentCount|100-1000': 1000,
              },
            ],
            total: '5',
            pageSize: '12',
            pageCount: '1',
            pageNum: '1',
          },
        })
      )
    }, 100)
  },
}
