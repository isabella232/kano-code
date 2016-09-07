"use strict";
module.exports = (gulp, $) => {

    function processModule() {
        let stream = gulp.src('app/scripts/kano/make-apps/parts-api/parts-api.html', { base: 'app' })
            .pipe($.utils.vulcanize({
                inlineScripts: true,
                stripComments: true
            }))
            .pipe($.crisper({ scriptInHead: false }));
            if (!process.env.ES6) {
                stream = stream.pipe($.if('*.js', $.babel({ presets: ['es2015'] })));
            }
            return stream;
    }


    /**
     * No need to babelify here, this code will be sent to a node environment
     */
    gulp.task('parts-api', () => {
        processModule()
            .pipe($.if('*.js', gulp.dest('www')));
    });

    gulp.task('parts-api-watch', () => {
        gulp.watch('app/scripts/kano/make-apps/parts-api/**/*')
            .on('change', (e) => {
                $.utils.notifyUpdate(`File ${e.path} was ${e.type}...`);
                processModule().pipe($.if('*.js', gulp.dest('www')));
            });
    });
};
