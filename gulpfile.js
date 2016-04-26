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
    bundler,
    utils;

bundler = browserify('app/scripts/app.js', watchify.args)
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
    return mapping;
}

// For a build with cordova, add this to html replace
// <meta http-equiv="Content-Security-Policy" content="media-src *">
gulp.task('js', ['babel', 'bundle', 'dom-util', 'client-util'], () => {
    gulp.src('./.tmp/app/index.html')
        .pipe(utils.vulcanize({ inlineScripts: true, inlineCss: true }))
        .pipe($.crisper({ scriptInHead: false }))
        .pipe($.htmlReplace(getHtmlReplaceOptions()))
        .pipe($.if(utils.isEnv('development'), $.connect.reload()))
        .pipe(gulp.dest('www'));
});

gulp.task('babel', ['sortable'], () => {
    return gulp.src('app/elements/**/*.{js,html}')
        .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
        .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
        .pipe(gulp.dest('.tmp/app/elements'));
});

gulp.task('sortable', ['copy'], () => {
    return gulp.src('.tmp/app/bower_components/Sortable/Sortable.html')
        .pipe($.rename('Sortable-es5.html'))
        .pipe($.crisper({ scriptInHead: false }))
        .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
        .pipe($.if('*.html', $.rename('Sortable.html')))
        .pipe(gulp.dest('.tmp/app/bower_components/Sortable'));
});

gulp.task('copy', () => {
    return gulp.src([
            'app/index.html',
            'app/bower_components/**/*',
            'app/assets/vendor/google-blockly/blockly_compressed.js',
            'app/assets/vendor/google-blockly/blocks_compressed.js',
            'app/assets/vendor/google-blockly/javascript_compressed.js',
            'app/assets/vendor/google-blockly/msg/js/en.js'
        ], { base: 'app'})
        .pipe(gulp.dest('.tmp/app'));
});

gulp.task('assets', ['scenes'], () => {
    gulp.src([
        'app/assets/**/*',
        'app/manifest.json',
        '!app/assets/stories/**/*.{js,html}'
    ], { base: 'app' })
        .pipe(gulp.dest('www'));
});

gulp.task('views', () => {
    // Get the elements common to the whole app to exclude them from the views
    getImports('./app/elements/elements.html').then((common) => {
        return gulp.src('app/views/**/*.html')
            .pipe(utils.vulcanize({
                inlineScripts: true,
                inlineCss: true,
                stripExcludes: common
            }))
            .pipe($.crisper({ scriptInHead: false }))
            .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
            .pipe(gulp.dest('www/views'));
    }).catch(utils.notifyError);
});

gulp.task('scenes', () => {
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
            .pipe(gulp.dest('www/assets/stories'));
    }).catch(utils.notifyError);
});

gulp.task('watch', () => {
    let watchers = [
        gulp.watch(['./app/index.html','./app/**/*.{js,html,css}'], ['js']),
        gulp.watch(['./app/views/**/*'], ['views']),
        gulp.watch(['./app/style/**/*'], ['sass']),
        gulp.watch(['./app/assets/stories/**/*'], ['assets'])
    ];
    watchers.forEach((watcher) => {
        watcher.on('change', function (event) {
            utils.notifyUpdate('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    });
    bundler = watchify(bundler).on('update', utils.bundle);
});

gulp.task('sass', () => {
    gulp.src('app/style/**/*.sass')
        .pipe($.sass({ includePaths: 'app/bower_components' }).on('error', utils.notifyError))
        .pipe(gulp.dest('.tmp/app/css'));
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

let DOMUtilBundler = browserify('app/scripts/util/dom.js', { standalone: 'DOMUtil' })
                        .transform(babelify.configure({ presets: ['es2015'] }));

gulp.task('dom-util', () => {
    DOMUtilBundler.bundle()
        .on('error', utils.notifyError)
        .pipe(source('dom.js'))
        .pipe(gulp.dest('.tmp/app/scripts/util/'));
});

let ClientUtilBundler = browserify('app/scripts/util/client.js', { standalone: 'ClientUtil' })
                        .transform(babelify.configure({ presets: ['es2015'] }));

gulp.task('client-util', () => {
    ClientUtilBundler .bundle()
        .on('error', utils.notifyError)
        .pipe(source('client.js'))
        .pipe(gulp.dest('.tmp/app/scripts/util/'));
});

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

gulp.task('dev', ['watch', 'serve']);
gulp.task('build', ['views', 'js', 'sass', 'assets']);
gulp.task('default', ['build']);
