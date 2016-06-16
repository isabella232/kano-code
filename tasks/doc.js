module.exports = (gulp, $) => {
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
};
