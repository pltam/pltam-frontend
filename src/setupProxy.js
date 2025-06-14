const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.jungho.xyz',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug'
    })
  );
  
  app.use(
    '/login',
    createProxyMiddleware({
      target: 'https://api.jungho.xyz',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug'
    })
  );

  app.use(
    '/oauth2',
    createProxyMiddleware({
      target: 'https://api.jungho.xyz',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug'
    })
  );
};
