/* jshint node:true */
'use strict';

let gulp = require('gulp'),
    vulcanize = require('gulp-vulcanize'),
    babel = require('gulp-babel'),
    babelify = require('babelify'),
    crisper = require('gulp-crisper'),
    connect = require('gulp-connect'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    clean = require('gulp-clean'),
    auth = require('basic-auth'),
    htmlreplace = require('gulp-html-replace'),
    sass = require('gulp-sass'),
    path = require('path'),
    $ = {
        if: require('gulp-if')
    },
    bundler = browserify('app/scripts/app.js', watchify.args)
        .transform(babelify.configure({ presets: ['es2015'] }));


function bundle() {
    console.log('Compiling JS...');

    return bundler.bundle()
        .on('error', function (err) {
            console.error(err);
            this.emit('end');
        })
        .pipe(source('app.js'))
        .pipe(gulp.dest('.tmp/app/scripts'));
}

gulp.task('bundle', bundle);

gulp.task('serve', () => {
    return connect.server({
        root: 'www',
        port: 4000,
        fallback: './www/index.html'
    });
});

gulp.task('serve-prod', () => {
    return connect.server({
        root: 'www',
        port: process.env.PORT,
        fallback: './www/index.html',
        middleware: (connect, opt) => {
            return [(req, res, next) => {
                let credentials = auth(req);

                if (!credentials || credentials.name !== 'kano-member' || credentials.pass !== 'Gb0yZGMb') {
                    res.statusCode = 401;
                    res.setHeader('WWW-Authenticate', 'Basic realm="example"');
                    res.end('Access denied');
                } else {
                    next();
                }
            }];
        }
    });
});

gulp.task('js', ['babel', 'bundle'], () => {
    gulp.src('./.tmp/app/index.html')
        .pipe(vulcanize({ inlineScripts: true }))
        .pipe(crisper({ scriptInHead: false }))
        .pipe(htmlreplace({ base: `
            <base href="/" target="_blank">
            <meta http-equiv="Content-Security-Policy" content="media-src *">
            ` }))
        .pipe(gulp.dest('www'));
});

gulp.task('babel', ['copy'], () => {
    return gulp.src('app/elements/**/*.html')
        .pipe(crisper({ scriptInHead: false }))
        .pipe($.if('*.js', babel({ presets: ['es2015'] })))
        .pipe(gulp.dest('.tmp/app/elements'));
});

gulp.task('copy', /*['clean'],*/ () => {
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
        '!app/assets/projects/**/*.{js,html}'
    ], { base: 'app' })
        .pipe(gulp.dest('www'));
});

gulp.task('clean', () => {
    return gulp.src('.tmp')
        .pipe(clean());
});

gulp.task('views', () => {
    gulp.src('app/views/**/*.html')
        .pipe(vulcanize({ inlineScripts: true }))
        .pipe(crisper({ scriptInHead: false }))
        .pipe($.if('*.js', babel({ presets: ['es2015'] })))
        .pipe(gulp.dest('www/views'));
});

gulp.task('scenes', () => {
    gulp.src('app/assets/projects/**/*.html')
        .pipe(vulcanize({ inlineScripts: true }))
        .pipe(crisper({ scriptInHead: false }))
        .pipe($.if('*.js', babel({ presets: ['es2015'] })))
        .pipe(gulp.dest('www/assets/projects'));
});

gulp.task('watch', () => {
    let watchers = [
        gulp.watch(['./app/index.html','./app/**/*.{js,html,css}'], ['js']),
        gulp.watch(['./app/views/**/*'], ['views']),
        gulp.watch(['./app/style/**/*'], ['sass']),
        gulp.watch(['./app/assets/projects/**/*'], ['assets']),
    ];
    watchers.forEach((watcher) => {
        watcher.on('change', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    });
    bundler = watchify(bundler).on('update', bundle);
    bundle();
});

gulp.task('sass', () => {
    gulp.src('app/style/**/*.sass')
        .pipe(sass({ includePaths: 'app/bower_components' }).on('error', sass.logError))
        .pipe(gulp.dest('www/css'));
});

gulp.task('dev', ['watch', 'serve']);

gulp.task('default', ['build']);
gulp.task('build', ['views', 'js', 'sass', 'assets']);
gulp.task('prod', ['build']);
