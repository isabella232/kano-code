'use strict';

module.exports = (gulp, $) => {
    let babelOrCopy = require('./babel-or-copy')(gulp, $);

    gulp.task('elements-dev', ['kano-canvas-api-dev'], () => {
        return babelOrCopy('app/elements/**/*.{js,html,css}', { base: 'app/elements/' })
            .pipe(gulp.dest('www/elements'))
            .pipe($.browserSync.stream());
    });

    gulp.task('scenes-dev', () => {
        return babelOrCopy('app/assets/stories/**/*.html')
            .pipe(gulp.dest('www/assets/stories'))
            .pipe($.browserSync.stream());
    });

    gulp.task('views-dev', () => {
        return babelOrCopy('app/views/**/*.{js,html,css}')
            .pipe(gulp.dest('www/views'))
            .pipe($.browserSync.stream());
    });

    gulp.task('style-dev', () => {
        return gulp.src('app/style/*.css')
            .pipe($.concat('main.css'))
            .pipe($.autoprefixer())
            .pipe(gulp.dest('www/css'))
            .pipe($.browserSync.stream());
    });

    gulp.task('index-dev', () => {
        return gulp.src('app/index.html')
            .pipe($.htmlReplace($.utils.getHtmlReplaceOptions()))
            .pipe($.if('*.html', $.utils.htmlAutoprefixerStream()))
            .pipe(gulp.dest('www'));
    });

    gulp.task('copy-dev', ['index-dev', 'polyfill'], () => {
        return gulp.src([
                'app/bower_components/**/*',
                'app/assets/vendor/google-blockly/blockly_compressed.js',
                'app/assets/vendor/google-blockly/blocks_compressed.js',
                'app/assets/vendor/google-blockly/javascript_compressed.js',
                'app/assets/vendor/google-blockly/msg/js/en.js',
                'app/assets/vendor/google-blockly/media/**/*',
                'app/assets/vendor/cache-polyfill/cache-polyfill.js',
                'app/scripts/util/dom.js',
                'app/scripts/util/client.js',
                'app/scripts/util/tracking.js',
                'app/scripts/util/router.js',
                'app/scripts/index.js'
            ], { base: 'app'})
            .pipe(gulp.dest('www'));
    });

    gulp.task('assets-dev', ['scenes-dev', 'blockly-media'], () => {
        return gulp.src([
            'app/assets/**/*',
            'app/assets/**/*',
            'app/manifest.json',
            '!app/assets/stories/**/*.{js,html}',
            '!app/assets/vendor/**/*'
        ], { base: 'app' })
            .pipe(gulp.dest('www'))
            .pipe($.browserSync.stream());
    });

    gulp.task('watch', ['app-modules-watch', 'parts-module-watch', 'app-watch'], () => {
        let watchers = [
            gulp.watch([
                'app/index.html',
                'app/bower_components/**/*',
                'app/scripts/util/dom.js',
                'app/scripts/util/client.js',
                'app/scripts/util/tracking.js',
                'app/scripts/util/router.js',
                'app/scripts/index.js'
            ], ['copy-dev']),
            gulp.watch(['app/elements/**/*'], ['elements-dev']),
            gulp.watch(['app/views/**/*'], ['views-dev']),
            gulp.watch(['app/style/**/*'], ['style-dev']),
            gulp.watch(['app/assets/stories/**/*'], ['assets-dev']),
            gulp.watch(['app/sw.js'], ['sw'])
        ];
        watchers.forEach((watcher) => {
            watcher.on('change', function (event) {
                $.utils.notifyUpdate('File ' + event.path + ' was ' + event.type + ', running tasks...');
            });
        });
    });

    gulp.task('dev', ['watch', 'serve']);
    gulp.task('build-dev', ['style-dev', 'app-dev', 'elements-dev', 'assets-dev', 'views-dev', 'copy-dev', 'app-modules-dev', 'parts-module-dev']);
};
