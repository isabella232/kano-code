'use strict';
module.exports = (gulp, $) => {
    let bundler = $.browserify('app/scripts/app-modules/index.js', { standalone: 'Kano.AppModules' })
            .transform($.babelify.configure({ presets: ['es2015'] }));

    function bundle() {
        $.utils.notifyUpdate('Browserify: compiling App modules...');
        return bundler
            .bundle()
            .on('error', $.utils.notifyError)
            .pipe($.source('index.js'))
            .pipe(gulp.dest('.tmp/app/scripts/app-modules'));
    }

    function bundleDev() {
        $.utils.notifyUpdate('Browserify: compiling App modules...');
        return bundler
            .bundle()
            .on('error', $.utils.notifyError)
            .pipe($.source('index.js'))
            .pipe(gulp.dest('www/scripts/app-modules'))
            .pipe($.browserSync.stream());
    }

    gulp.task('app-modules-dev', bundle);
    gulp.task('app-modules', bundleDev);

    gulp.task('app-modules-watch', () => {
        bundler = bundler.plugin($.watchify).on('update', bundleDev);
        bundleDev();
    });
};
