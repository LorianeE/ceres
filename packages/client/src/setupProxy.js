const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/rest',
    createProxyMiddleware('/rest', {
      target: 'http://localhost:8083',
    })
  );
};
