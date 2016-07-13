'use strict';
var swPrecache = require('sw-precache'),
    packageJson = require('../package.json');

module.exports = (gulp, $) => {
    function writeServiceWorker(handleFetch, callback) {
        let config = {
            cacheId: packageJson.name,
            logger: $.utils.notifyUpdate,
            staticFileGlobs: ['www/**/*'],
            stripPrefix: 'www',
            navigateFallback: '/index.html',
            handleFetch,
            // Max 3Mb
            maximumFileSizeToCacheInBytes: 3145728,
            verbose: true,
            runtimeCaching: [{
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/css/,
                handler: 'cacheFirst'
            }]
        };
        swPrecache.write('www/sw.js', config, callback);
    }

    gulp.task('sw', (cb) => {
        writeServiceWorker(true, cb);
    });
    gulp.task('sw-dev', (cb) => {
        writeServiceWorker(false, cb);
    });
};
