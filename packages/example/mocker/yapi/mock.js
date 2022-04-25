module.exports = {
  'POST /mock-middleware/yapiMockApi/mock': {
    response: {
      returncode: '10000',
      message: 'mock数据测试',
      body: {
        随机生成boolean: '@boolean',
        '随机生成1-100之间的数字': '@natural(1,100)',
        随机生成浮点数: '@float',
        随机生成一段英文文本: '@paragraph',
        随机生成一段中文文本: '@cparagraph',
        随机生成英文标题: '@title',
        随机生成中文标题: '@csentence(2, 30)',
        随机生成人名: '@name',
        随机生成省市区: '@province @city @county',
        随机生成邮政编码: '@zip',
        随机生成url链接: '@url',
        随机生成不同大小图片url: '@image',
        随机生成rgb颜色: '@color',
        随机生成邮箱号: '@email',
        随机生成时间: '@date("yyyy-MM-dd HH:mm:ss")',
      },
    },
  },
}
