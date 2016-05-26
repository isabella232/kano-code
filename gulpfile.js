/* jshint node:true */
'use strict';

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ lazy: false }),
    babelify = require('babelify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    path = require('path'),
    fs = require('fs'),
    es = require('event-stream'),
    htmlAutoprefixer = require("html-autoprefixer"),
    bundler,
    utils,
    env = 'prod';

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
    }
};

gulp.task('bundle', utils.bundle);

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

function getHtmlReplaceOptions() {

    let mapping = {
        config: `<script type="text/javascript">
                ${utils.getEnvVars()}
            </script>`,
        base: `<base href="/" />`
    };

    if (process.env.TARGET === 'rpi' || process.env.TARGET === 'osonline') {
        mapping.style = `<style>
            .animatable {
                animation: none !important;
                transition: none !important;
            }
        </style>`;
    }

    if (env === 'prod') {
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

// For a build with cordova, add this to html replace
// <meta http-equiv="Content-Security-Policy" content="media-src *">
gulp.task('js', ['babel', 'bundle', 'copy', 'polyfill'], () => {
    gulp.src('./.tmp/app/elements/elements.html')
        .pipe(utils.vulcanize({ inlineScripts: true, inlineCss: true }))
        .pipe($.crisper({ scriptInHead: false }))
        .pipe(gulp.dest('www/elements'));
});

gulp.task('babel', () => {
    return gulp.src('app/elements/**/*.{js,html,css}')
        .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
        .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
        .pipe(gulp.dest('.tmp/app/elements'));
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
            'app/scripts/util/tracking.js'
        ], { base: 'app'})
        .pipe(gulp.dest('.tmp/app'));
});

gulp.task('copy-index', () => {
    return gulp.src(['app/index.html', 'app/scripts/index.js'], { base: 'app' })
        .pipe($.if('index.html', $.htmlReplace(getHtmlReplaceOptions())))
        .pipe(gulp.dest('www'));
});

gulp.task('assets', ['scenes'], () => {
    gulp.src([
        'app/assets/**/*',
        'app/manifest.json',
        '!app/assets/stories/**/*.{js,html}'
    ], { base: 'app' })
        .pipe(gulp.dest('www'));
});

gulp.task('views', ['copy'], () => {
    // Get the elements common to the whole app to exclude them from the views
    getImports('./app/elements/elements.html').then((common) => {
        return gulp.src('app/views/**/*.html')
            .pipe(utils.vulcanize({
                inlineScripts: true,
                inlineCss: true,
                stripExcludes: common
            }))
            .pipe($.crisper({ scriptInHead: false }))
            .pipe($.if('*.html', utils.htmlAutoprefixerStream()))
            .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
            .pipe(gulp.dest('www/views'));
    }).catch(utils.notifyError);
});

gulp.task('scenes', ['copy'], () => {
    // Get the elements common to the whole app to exclude them from the views
    getImports('./app/elements/elements.html').then((common) => {
        return gulp.src('app/assets/stories/**/*.html')
            .pipe(utils.vulcanize({
                inlineScripts: true,
                inlineCss: true,
                stripExcludes: common
            }))
            .pipe($.crisper({ scriptInHead: false }))
            .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
            .pipe($.if('*.html', utils.htmlAutoprefixerStream()))
            .pipe(gulp.dest('www/assets/stories'));
    }).catch(utils.notifyError);
});

gulp.task('sass', () => {
    gulp.src('app/style/main.sass')
        .pipe($.sass({ includePaths: 'app/bower_components' }).on('error', utils.notifyError))
        .pipe($.autoprefixer())
        .pipe(gulp.dest('www/css'));
});

function getImports(filePath, opts) {
    let found = [];
    opts = opts || {};

    function crawlImports(filePath) {
        return new Promise((resolve, reject) => {
            let dir = path.dirname(filePath);
            fs.readFile(filePath, (err, file) => {
                if (err) {
                    return resolve();
                }
                found.push(filePath);
                let content = file.toString(),
                importRegex = /<link.*rel="import".*>/gi,
                imports = content.match(importRegex),
                fileRegex,
                files,
                tasks;
                if (!imports) {
                    return resolve();
                }
                fileRegex = /href="(.*)"/,
                files = imports.map((importLine) => {
                    let m = importLine.match(fileRegex);
                    if (m && m[1]) {
                        return path.join(dir, m[1]);
                    }
                    return null;
                }).filter((f) => {
                    if (!f) {
                        return false;
                    }
                    if (found.indexOf(f) === -1) {
                        return true;
                    }
                });
                tasks = files.map((f) => {
                    return crawlImports(f);
                });
                return Promise.all(tasks).then(() => {
                    return resolve(found);
                }).catch(reject);
            });
        });
    }
    return crawlImports(filePath).then((files) => {
        files = files.filter((item, pos, self) => {
            return self.indexOf(item) == pos;
        });
        if (opts.base) {
            files = files.map((filePath) => {
                return path.relative(opts.base, filePath);
            });
        }
        return files;
    });
}

gulp.task('compress', () => {
    return gulp.src(['www/**/*.{js,html}'])
        .pipe($.if('*.html', $.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            removeComments: true
        })))
        .pipe($.if('*.js', $.uglify()))
        .on('error', utils.notifyError)
        .pipe(gulp.dest('www'));
});

gulp.task('build', ['views', 'js', 'sass', 'assets']);
gulp.task('default', ['build']);

/* DEVELOPMENT BUILD */

/**
 * Skip babel if the target env is ES6 capable
 */
function babelOrCopy(src, opts) {
    let stream = gulp.src(src, opts);
    if (!process.env.ES6) {
        stream = stream
            .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
            .pipe($.if('*.html', utils.htmlAutoprefixerStream()))
            .pipe($.if('*.js', $.babel({ presets: ['es2015'] })));
    }
    return stream;
}

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
        .pipe($.sass({ includePaths: 'app/bower_components' }).on('error', utils.notifyError))
        .pipe($.autoprefixer())
        .pipe($.connect.reload())
        .pipe(gulp.dest('www/css'));
});

gulp.task('index-dev', () => {
    gulp.src('app/index.html')
        .pipe($.htmlReplace(getHtmlReplaceOptions()))
        .pipe($.if('*.html', utils.htmlAutoprefixerStream()))
        .pipe(gulp.dest('www'));
});

gulp.task('copy-dev', ['index-dev', 'polyfill'], () => {
    return gulp.src([
            'app/bower_components/**/*',
            'app/assets/vendor/google-blockly/blockly_compressed.js',
            'app/assets/vendor/google-blockly/blocks_compressed.js',
            'app/assets/vendor/google-blockly/javascript_compressed.js',
            'app/assets/vendor/google-blockly/msg/js/en.js',
            'app/scripts/util/dom.js',
            'app/scripts/util/client.js',
            'app/scripts/util/tracking.js',
            'app/scripts/index.js'
        ], { base: 'app'})
        .pipe($.connect.reload())
        .pipe(gulp.dest('www'));
});

gulp.task('polyfill', () => {
    return gulp.src('app/bower_components/webcomponentsjs/webcomponents-lite.min.js')
        .pipe(gulp.dest('www/assets/vendor/webcomponentsjs/'));
});

gulp.task('assets-dev', ['scenes-dev'], () => {
    gulp.src([
        'app/assets/**/*',
        'app/manifest.json',
        '!app/assets/stories/**/*.{js,html}'
    ], { base: 'app' })
        .pipe($.connect.reload())
        .pipe(gulp.dest('www'));
});

gulp.task('bundle-dev', utils.bundleDev);

gulp.task('watch', () => {
    let watchers = [
        gulp.watch([
            'app/index.html',
            'app/bower_components/**/*',
            'app/scripts/util/dom.js',
            'app/scripts/util/client.js',
            'app/scripts/util/tracking.js',
            'app/scripts/index.js'
        ], ['copy-dev']),
        gulp.watch(['app/elements/**/*'], ['elements-dev']),
        gulp.watch(['app/views/**/*'], ['views-dev']),
        gulp.watch(['app/style/**/*'], ['sass-dev']),
        gulp.watch(['app/assets/stories/**/*'], ['assets-dev'])
    ];
    watchers.forEach((watcher) => {
        watcher.on('change', function (event) {
            utils.notifyUpdate('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    });
    bundler = bundler.plugin(watchify).on('update', utils.bundleDev);
    utils.bundleDev();
});

gulp.task('copy-test', () => {
    return babelOrCopy('app/test/**/*.{js,html}', { base: 'app/test/' })
        .pipe(gulp.dest('www/test'));
});

gulp.task('doc', ['copy-doc'], () => {
    gulp.src('app/doc/**/*')
        .pipe($.if('index.html', $.htmlReplace({ doc: `
            <script>window.ELEMENTS_LOCATION = './elements/';</script>
        ` })))
        .pipe($.if('*.html', $.replace(/(href|src)="\.\.\/bower_components(.+)\.html"/g, '$1="./bower_components$2.html"')))
        .pipe(gulp.dest('www-doc'));
});

gulp.task('copy-doc', () => {
    gulp.src(['app/elements/**/*', 'app/bower_components/**/*', 'app/assets/**/*'], { base: 'app/' })
        .pipe(gulp.dest('www-doc'));
});

gulp.task('configure-dev', () => {
    env = 'dev';
});

gulp.task('dev', ['watch', 'serve']);
gulp.task('build-dev', ['configure-dev', 'sass-dev', 'bundle-dev', 'elements-dev', 'assets-dev', 'views-dev', 'copy-dev']);
