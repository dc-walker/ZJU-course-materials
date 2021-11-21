const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/login',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/signup',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/getDevices',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/deleteDevice',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/addDevice',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/getHistory',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/getLocations',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/setAlias',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/setPassword',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/getMessagesCount',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
    app.use(
        '/getDeviceStates',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        })
    );
};