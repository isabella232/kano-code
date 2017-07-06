'use strict';
module.exports = (gulp, $) => {

    const WORKERS_SRC = [
        './app/bower_components/gif.js/dist/gif.worker.js',
        './app/scripts/kano/make-apps/parts-api/canvas-filters.html',
        './app/scripts/kano/gif-encoder/worker-neu.js',
        './app/scripts/kano/gif-encoder/worker-rgb.js',
        './app/assets/vendor/neuquant/NeuQuant.js',
        './app/assets/vendor/rgbquant/RgbQuant.js'
    ];

    function generateWorkers(src) {
        return gulp.src(src, { base: 'app' })
            .pipe($.if('*.html', $.utils.vulcanize({
                inlineScripts: true,
                stripComments: true
            })))
            .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
            .pipe($.if('*.js', gulp.dest('www')));
    }

    gulp.task('workers', () => {
        return generateWorkers(WORKERS_SRC);
    });
};
