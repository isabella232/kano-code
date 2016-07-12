'use strict';
module.exports = (gulp, $) => {
    let bundler = $.browserify('app/scripts/app-modules/index.js', { standalone: 'Kano.AppModules' })
            .transform($.babelify.configure({ presets: ['es2015'] }));

    function bundle(target, refresh) {
        return () => {
            let stream = bundler
                .bundle()
                .on('error', $.utils.notifyError)
                .pipe($.source('index.js'))
                .pipe(gulp.dest(target));
            if (refresh) {
                stream = stream.pipe($.browserSync.stream());
            }
            return stream;
        };
    }

    gulp.task('app-modules-dev', bundle('www/scripts/app-modules', true));
    gulp.task('app-modules', bundle('.tmp/app/scripts/app-modules'));

    gulp.task('app-modules-watch', () => {
        bundler = bundler.plugin($.watchify).on('update', bundle('www/scripts/app-modules', true));
        bundle('www/scripts/app-modules', true)();
    });
};
