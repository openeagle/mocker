module.exports = {
  base: '/mocker/',
  title: 'HTTP Mocker',
  description: 'HTTP 接口模拟器。',
  themeConfig: {
    nav: [
      { text: '教程', link: '/guide/installation' },
      { text: 'API', link: '/api/config' },
    ],
    displayAllHeaders: true,
    sidebar: {
      '/guide/': [
        'introduction',
        'principle',
        'installation',
        {
          title: '配置',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            'configuration/local',
            'configuration/yapi',
          ],
        },
      ],
      '/api/': [
        {
          title: '中间件配置',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            'config'
          ],
        },
        {
          title: '自定义 Mock',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            ['local/options', '参数说明'],
            ['local/disabled/markdown', 'disabled'],
            ['local/mergeable/markdown', 'mergeable'],
            ['local/status/markdown', 'status'],
            ['local/delay/markdown', 'delay'],
            ['local/response/markdown', 'response'],
            ['local/testcase/markdown', 'tesing | testcase'],
          ],
        },
      ],
    },
    sidebarDepth: 0,
  },
}
