'use strict';
module.exports = (gulp, $) => {

    const WORKERS_SRC = [
        './app/bower_components/gif.js/dist/gif.worker.js'
    ];

    gulp.task('workers', () => {
        gulp.src(WORKERS_SRC)
            .pipe(gulp.dest('./www/scripts/workers'));
    });
};
