const path = require('path')

module.exports = {
  publicPath: '/mocker/example/',
  lintOnSave: false,
  devServer: {
    port: '6600',
    before(app) {
      const httpMockMiddleware = require('@openeagle/http-mock-middleware')
      httpMockMiddleware(app, require('./http.mock.config'))
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'eval' : false,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
}
