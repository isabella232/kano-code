module.exports = (gulp, $) => {

    function process() {
        return gulp.src('app/scripts/kano/make-apps/parts-api/parts-api.html', { base: 'app' })
            .pipe($.utils.vulcanize({
                inlineScripts: true,
                stripComments: true
            }))
            .pipe($.crisper({ scriptInHead: false }))
    }


    /**
     * No need to babelify here, this code will be sent to a node environment
     */
    gulp.task('parts-api', () => {
        process()
            .pipe($.if('*.js', gulp.dest('www')));
    });

    gulp.task('parts-api-watch', () => {
        gulp.watch('app/scripts/kano/make-apps/parts-api/**/*')
            .on('change', (e) => {
                $.utils.notifyUpdate(`File ${e.path} was ${e.type}...`);
                process().pipe($.if('*.js', gulp.dest('www')));
            });
    });
};
