const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  // 将请求转发到后端的地址
  app.use(
    '/user',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/dataset',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/files',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/tasktype',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/entity',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/relation',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/annotationtask',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/infosource',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/infosourcefile',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/home',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/log',
    createProxyMiddleware({
      target: 'http://localhost:9090', // 后端地址
      changeOrigin: true,
    })
  )
  app.use(
    '/dataset-files',
    createProxyMiddleware({
      target: 'http://localhost:10000', // nginx服务
      changeOrigin: true,
    })
  )


}
