'use strict';

module.exports = (gulp, $) => {
    let babelOrCopy = require('./babel-or-copy')(gulp, $),
        bundler = $.browserify('app/scripts/app.js', { cache: {}, packageCache: {} })
            .transform($.babelify.configure({ presets: ['es2015'] }));

    gulp.task('elements-dev', () => {
        return babelOrCopy('app/elements/**/*.{js,html,css}', { base: 'app/elements/' })
            .pipe($.connect.reload())
            .pipe(gulp.dest('www/elements'));
    });

    gulp.task('scenes-dev', () => {
        return babelOrCopy('app/assets/stories/**/*.html')
            .pipe($.connect.reload())
            .pipe(gulp.dest('www/assets/stories'));
    });

    gulp.task('views-dev', () => {
        return babelOrCopy('app/views/**/*.{js,html,css}')
            .pipe($.connect.reload())
            .pipe(gulp.dest('www/views'));
    });

    gulp.task('sass-dev', () => {
        gulp.src('app/style/main.sass')
            .pipe($.sass({ includePaths: 'app/bower_components' }).on('error', $.utils.notifyError))
            .pipe($.autoprefixer())
            .pipe($.connect.reload())
            .pipe(gulp.dest('www/css'));
    });

    gulp.task('index-dev', () => {
        gulp.src('app/index.html')
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
            .pipe($.connect.reload())
            .pipe(gulp.dest('www'));
    });

    gulp.task('assets-dev', ['scenes-dev', 'blockly-media'], () => {
        gulp.src([
            'app/assets/**/*',
            'app/assets/**/*',
            'app/manifest.json',
            '!app/assets/stories/**/*.{js,html}',
            '!app/assets/vendor/**/*'
        ], { base: 'app' })
            .pipe($.connect.reload())
            .pipe(gulp.dest('www'));
    });

    gulp.task('bundle-dev', $.utils.bundleDev);

    gulp.task('watch', () => {
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
            gulp.watch(['app/style/**/*'], ['sass-dev']),
            gulp.watch(['app/assets/stories/**/*'], ['assets-dev']),
            gulp.watch(['app/scripts/parts/**/*'], ['parts-module-dev']),
            gulp.watch(['app/scripts/app-modules/**/*'], ['app-modules-dev']),
            gulp.watch(['app/sw.js'], ['sw'])
        ];
        watchers.forEach((watcher) => {
            watcher.on('change', function (event) {
                $.utils.notifyUpdate('File ' + event.path + ' was ' + event.type + ', running tasks...');
            });
        });
        bundler = bundler.plugin($.watchify).on('update', $.utils.bundleDev);
        $.utils.bundleDev();
    });

    gulp.task('dev', ['watch', 'serve']);
    gulp.task('build-dev', ['sass-dev', 'bundle-dev', 'elements-dev', 'assets-dev', 'views-dev', 'copy-dev', 'app-modules-dev', 'parts-module-dev']);
};
