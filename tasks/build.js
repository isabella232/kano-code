'use strict';

let getImports = require('./get-imports');

module.exports = (gulp, $) => {

    gulp.task('bundle', $.utils.bundle);

    gulp.task('serve', () => {
        return $.connect.server({
            root: 'www',
            port: 4000,
            fallback: './www/index.html',
            livereload: true
        });
    });

    gulp.task('serve-doc', () => {
        return $.connect.server({
            root: 'app',
            port: process.env.PORT || 5000
        });
    });

    gulp.task('serve-prod', () => {
        return $.connect.server({
            root: 'www',
            port: process.env.PORT,
            fallback: './www/index.html'
        });
    });

    // For a build with cordova, add this to html replace
    // <meta http-equiv="Content-Security-Policy" content="media-src *">
    gulp.task('js', ['babel', 'bundle', 'polyfill'], () => {
        gulp.src('./.tmp/app/elements/elements.html')
            .pipe($.utils.vulcanize({
                inlineScripts: true,
                inlineCss: true,
                stripComments: true
            }))
            .pipe($.crisper({ scriptInHead: false }))
            .pipe(gulp.dest('www/elements'));
    });

    gulp.task('bundles', ['copy', 'babel', 'parts-module', 'app-modules'], () => {
        getImports('./app/elements/elements.html').then((common) => {
            return gulp.src('.tmp/app/elements/*-bundle.html')
                .pipe($.utils.vulcanize({
                    inlineScripts: true,
                    inlineCss: true,
                    stripExcludes: common,
                    stripComments: true
                }))
                .pipe($.crisper({ scriptInHead: false }))
                .pipe(gulp.dest('www/elements'));
        }).catch($.utils.notifyError);
    });

    gulp.task('babel', ['copy'], () => {
        return gulp.src(['app/elements/**/*.{js,html,css}', 'app/bower_components/kano-*/**/*.{html,js}'], { base: 'app' })
            .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
            .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
            .pipe(gulp.dest('.tmp/app'));
    });

    gulp.task('copy', ['copy-index'], () => {
        return gulp.src([
                'app/bower_components/**/*',
                'app/assets/vendor/google-blockly/blockly_compressed.js',
                'app/assets/vendor/google-blockly/blocks_compressed.js',
                'app/assets/vendor/google-blockly/javascript_compressed.js',
                'app/assets/vendor/google-blockly/msg/js/en.js',
                'app/scripts/util/dom.js',
                'app/scripts/util/client.js',
                'app/scripts/util/tracking.js',
                'app/scripts/util/router.js'
            ], { base: 'app'})
            .pipe(gulp.dest('.tmp/app'));
    });

    gulp.task('copy-index', () => {
        return gulp.src(['app/index.html', 'app/scripts/index.js', 'app/assets/vendor/cache-polyfill/cache-polyfill.js'], { base: 'app' })
            .pipe($.if('index.html', $.htmlReplace($.utils.getHtmlReplaceOptions())))
            .pipe(gulp.dest('www'));
    });

    gulp.task('blockly-media', () => {
        gulp.src([
            'app/assets/vendor/google-blockly/media/**/*'
        ], { base: 'app' })
            .pipe(gulp.dest('www'));
    });

    gulp.task('assets', ['scenes', 'blockly-media'], () => {
        gulp.src([
            'app/assets/**/*',
            'app/manifest.json',
            '!app/assets/stories/**/*.{js,html}',
            '!app/assets/vendor/**/*'
        ], { base: 'app' })
            .pipe(gulp.dest('www'));
    });

    gulp.task('views', ['copy'], () => {
        return gulp.src('app/views/**/*.html')
            .pipe($.crisper({ scriptInHead: false }))
            .pipe($.if('*.html', $.utils.htmlAutoprefixerStream()))
            .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
            .pipe(gulp.dest('www/views'));
    });

    gulp.task('scenes', ['copy'], () => {
        // The core elements and the elements already present in the view are removed
        Promise.all([getImports('./app/elements/elements.html'), getImports('./app/views/kano-view-story/kano-view-story.html')])
            .then((commons) => {
                return commons.reduce((acc, common) => {
                    return acc.concat(common);
                }, []);
            }).then((common) => {
                return gulp.src('app/assets/stories/**/*.html')
                    .pipe($.utils.vulcanize({
                        inlineScripts: true,
                        inlineCss: true,
                        stripExcludes: common,
                        stripComments: true
                    }))
                    .pipe($.crisper({ scriptInHead: false }))
                    .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
                    .pipe($.if('*.html', $.utils.htmlAutoprefixerStream()))
                    .pipe(gulp.dest('www/assets/stories'));
            }).catch($.utils.notifyError);
    });

    gulp.task('sass', () => {
        gulp.src('app/style/main.sass')
            .pipe($.sass({ includePaths: 'app/bower_components' }).on('error', $.utils.notifyError))
            .pipe($.autoprefixer())
            .pipe(gulp.dest('www/css'));
    });

    gulp.task('compress', () => {
        return gulp.src(['www/**/*.{js,html}'])
            .pipe($.if('*.html', $.htmlmin({
                collapseWhitespace: true,
                minifyCSS: true,
                removeComments: true
            })))
            .pipe($.if('*.js', $.uglify()))
            .on('error', $.utils.notifyError)
            .pipe(gulp.dest('www'));
    });

    gulp.task('build', () => {
        $.runSequence(['views', 'js', 'sass', 'assets', 'bundles'], 'sw');
    });
    gulp.task('default', ['build']);
};
