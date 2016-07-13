'use strict';
module.exports = (gulp, $) => {
    let bundler = $.browserify('app/scripts/app.js', { cache: {}, packageCache: {} })
        .transform($.babelify.configure({ presets: ['es2015'] }));

    function bundle(target, refresh) {
        return () => {
            let stream = bundler
                .bundle()
                .on('error', $.utils.notifyError)
                .pipe($.source('app.js'))
                .pipe(gulp.dest(target));
            if (refresh) {
                stream = stream.pipe($.browserSync.stream());
            }
            return stream;
        };
    }

    gulp.task('app-dev', bundle('www/scripts', true));
    gulp.task('app', bundle('.tmp/app/scripts'));

    gulp.task('app-watch', () => {
        bundler = bundler.plugin($.watchify).on('update', bundle('www/scripts', true));
        bundle('www/scripts', true)();
    });
};
