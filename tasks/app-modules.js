'use strict';
module.exports = (gulp, $) => {
    let appModules = $.browserify('app/scripts/app-modules/index.js', { standalone: 'Kano.AppModules' })
            .transform($.babelify.configure({ presets: ['es2015'] }))
            .bundle()
            .on('error', $.utils.notifyError)
            .pipe($.source('index.js'));

    gulp.task('app-modules-dev', () => {
        appModules.pipe(gulp.dest('www/scripts/app-modules'));
    });
    gulp.task('app-modules', () => {
        appModules.pipe(gulp.dest('.tmp/app/scripts/app-modules'));
    });
};
