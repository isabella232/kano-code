const connect = require('connect');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');

const namedResolutionMiddleware = require('./named-resolution-middleware');

connect()
    .use(history())
    .use(namedResolutionMiddleware({ modulesDir: '../' }))
    .use(serveStatic(`${__dirname}/../app`))
    .use(serveStatic(`${__dirname}/../`))
    .listen(4000);

console.log('Serving at http://localhost:4000');
