'use strict';
module.exports = (gulp, $) => {
    let babelOrCopy = require('./babel-or-copy')(gulp, $);
    gulp.task('copy-test', () => {
        return babelOrCopy('app/test/**/*.{js,html}', { base: 'app/test/' })
            .pipe(gulp.dest('www/test'));
    });
};
