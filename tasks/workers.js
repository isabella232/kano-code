'use strict';
module.exports = (gulp, $) => {

    const WORKERS_SRC = [
        './app/bower_components/gif.js/dist/gif.worker.js',
        './app/scripts/kano/make-apps/parts-api/canvas-filters.html'
    ];

    function generateWorkers(src) {
        return gulp.src(src)
            .pipe($.if('*.html', $.utils.vulcanize({
                inlineScripts: true,
                stripComments: true
            })))
            .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
            .pipe($.if('*.js', gulp.dest('./www/scripts/workers')));
    }

    gulp.task('workers', () => {
        return generateWorkers(WORKERS_SRC);
    });

    gulp.task('workers-watch', () => {
        gulp.watch(WORKERS_SRC)
            .on('change', (e) => {
                $.utils.notifyUpdate(`File ${e.path} was ${e.type}...`);
                return generateWorkers(e.path);
            });
    });
};
