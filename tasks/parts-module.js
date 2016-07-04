'use strict';
module.exports = (gulp, $) => {
    let partsModule = $.browserify('app/scripts/parts/index.js', { standalone: 'Kano.MakeApps.Parts' })
            .transform($.babelify.configure({ presets: ['es2015'] }))
            .bundle()
            .on('error', $.utils.notifyError)
            .pipe($.source('index.js'));
    gulp.task('parts-module-dev', () => {
        partsModule.pipe(gulp.dest('www/scripts/parts'));
    });
    gulp.task('parts-module', () => {
        partsModule.pipe(gulp.dest('.tmp/app/scripts/parts'));
    });
};
