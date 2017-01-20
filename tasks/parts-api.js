"use strict";
module.exports = (gulp, $) => {

    /**
     * No need to babelify here, this code will be sent to a node environment
     */
    gulp.task('parts-api', () => {
        let stream = gulp.src('app/scripts/kano/make-apps/parts-api/parts-api.html', { base: 'app' })
            .pipe($.vulcanize())
            .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
            .pipe($.if('*.js', $.transpile()))
            .pipe($.if('*.js', gulp.dest('www')));
        return stream;
    });
};
