'use strict';
let wct = require('web-component-tester'),
    conf = require('../wct.conf.json');

function hasExt(ext) {
    return (file) => {
        return file.relative.split('.').pop() === ext;
    }
}

module.exports = (gulp, $) => {
    gulp.task('copy-test', () => {
        return gulp.src('app/test/**/*.{js,html}', { base: 'app/test/' })
            .pipe($.if(hasExt('html'), $.crisper({ scriptInHead: false })))
            .pipe($.if(hasExt('js'), $.transpile()))
            .pipe(gulp.dest('www/test'));
    });

    gulp.task('wct', ['copy-test'], (next) => {
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
