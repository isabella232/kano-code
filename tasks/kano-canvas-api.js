'use strict';
module.exports = (gulp, $) => {
    let canvasApi = $.browserify('app/assets/vendor/kano-canvas-api/kano-canvas-api.js', { standalone: 'Kano.CanvasAPI' })
            .transform($.babelify.configure({ presets: ['es2015'] }))
            .bundle()
            .on('error', $.utils.notifyError)
            .pipe($.source('kano-canvas-api.js'));

    gulp.task('kano-canvas-api-dev', () => {
        canvasApi.pipe(gulp.dest('www/assets/vendor/kano-canvas-api'));
    });
    gulp.task('kano-canvas-api', () => {
        canvasApi.pipe(gulp.dest('.tmp/app/assets/vendor/kano-canvas-api'));
    });
};
