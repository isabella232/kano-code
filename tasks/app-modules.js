module.exports = (gulp, $) => {

    function process() {
        return gulp.src('app/scripts/kano/app-modules/index.html', { base: 'app' })
            .pipe($.utils.vulcanize({
                inlineScripts: true,
                stripComments: true
            }))
            .pipe($.crisper({ scriptInHead: false }))
    }


    /**
     * No need to babelify here, this code will be sent to a node environment
     */
    gulp.task('app-modules', () => {
        process()
            .pipe($.if('*.js', gulp.dest('www')));
    });

    gulp.task('app-modules-watch', () => {
        gulp.watch('app/scripts/kano/app-modules/**/*')
            .on('change', (e) => {
                $.utils.notifyUpdate(`File ${e.path} was ${e.type}...`);
                process().pipe($.if('*.js', gulp.dest('www')));
            });
    });
};
