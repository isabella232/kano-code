'use strict';
let wct = require('web-component-tester'),
    conf = require('../wct.conf.json');

module.exports = (gulp, $) => {

    gulp.task('wct', (next) => {
        wct.cli.run(conf, [], process.stdout).then(() => {
            next();
            // Force process exit to kill resilient browsers
            process.exit();
        }).catch(e => {
            next(e);
            process.exit(1);
        });
    });
};
