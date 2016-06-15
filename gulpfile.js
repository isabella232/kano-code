/* jshint node:true */
'use strict';

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ lazy: false }),
    babelify = require('babelify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    es = require('event-stream'),
    htmlAutoprefixer = require("html-autoprefixer"),
    config = require('./app/scripts/config').getConfig(process.env.NODE_ENV,
                                                     process.env.TARGET),
    runSequence = require('run-sequence'),
    bundler,
    utils;

require('web-component-tester').gulp.init(gulp, ['copy-test', 'build-dev']);

bundler = browserify('app/scripts/app.js', { cache: {}, packageCache: {} })
        .transform(babelify.configure({ presets: ['es2015'] }));

utils = {
    notifyError: $.notify.onError((error) => {
        $.util.beep();
        return error.message || error;
    }),
    notifyUpdate (message) {
        return $.util.log($.util.colors.blue(message));
    },
    // Wrap vulcanize to automatically add error reporting
    vulcanize (options) {
        return $.vulcanize(options)
            .on('error', utils.notifyError);
    },
    bundle () {
        utils.notifyUpdate('Browserify: compiling JS...');
        return bundler.bundle()
            .on('error', utils.notifyError)
            .pipe(source('app.js'))
            .pipe(gulp.dest('.tmp/app/scripts'));
    },
    bundleDev () {
        utils.notifyUpdate('Browserify: compiling JS...');
        return bundler.bundle()
            .on('error', utils.notifyError)
            .pipe(source('app.js'))
            .pipe($.connect.reload())
            .pipe(gulp.dest('www/scripts'));
    },
    /*
     * gulp-html-autoprefixer points to an outdated version.
     * Putting this here until they fix it.
     */
    htmlAutoprefixerStream () {
        return es.map(function (file, done) {
            let htmlString = file.contents.toString(),
                prefixed = htmlAutoprefixer.process(htmlString);
            file.contents = new Buffer(prefixed);

            next();

            function next(err) {
                done(err, file);
            }
        });
    },
    getEnvVars () {
        var code = '';
        if (process.env.NODE_ENV) {
            code += "window.ENV = '" + process.env.NODE_ENV + "';\n";
        }

        if (process.env.TARGET) {
            code += "window.TARGET = '" + process.env.TARGET + "';\n";
        }

        return code;
    },
    isEnv (env) {
        return process.env.NODE_ENV === env;
    },
    getHtmlReplaceOptions () {

        let mapping = {
            config: `<script type="text/javascript">
                    ${utils.getEnvVars()}
                </script>`,
            base: `<base href="/" />`,
            meta: {
                src: config.DEFAULT_META_DATA,
                tpl: '<meta name="%s" content="%s">'
            }
        };

        if (process.env.TARGET === 'rpi' || process.env.TARGET === 'osonline') {
            mapping.style = `<style>
                .animatable {
                    animation: none !important;
                    transition: none !important;
                }
            </style>`;
        }

        if (process.env.NODE_ENV === 'production') {
            mapping.gtm = `<noscript>
                <iframe src='//www.googletagmanager.com/ns.html?id=GTM-WMGKFR' height='0' width='0' style='display: none; visibility: hidden;'></iframe>
            </noscript>
            <script type='text/javascript'>
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-WMGKFR');
            </script>`;
        }

        return mapping;
    }
};

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

$.browserify = browserify;
$.babelify = babelify;
$.utils = utils;
$.source = source;
$.watchify = watchify;
$.runSequence = runSequence;

// Copy the webcomponents polyfill to the vendor folder
gulp.task('polyfill', () => {
    return gulp.src('app/bower_components/webcomponentsjs/webcomponents-lite.min.js')
        .pipe(gulp.dest('www/assets/vendor/webcomponentsjs/'));
});

$.updateSW = require('./tasks/service-worker')(gulp, $);
require('./tasks/app-modules')(gulp, $);
require('./tasks/parts-module')(gulp, $);
require('./tasks/dev')(gulp, $);
require('./tasks/build')(gulp, $);
require('./tasks/test')(gulp, $);
require('./tasks/doc')(gulp, $);
