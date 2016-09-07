"use strict";
module.exports = (gulp, $) => {

    function processModules() {
        let stream = gulp.src('app/scripts/kano/app-modules/index.html', { base: 'app' })
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
    gulp.task('app-modules', () => {
        processModules()
            .pipe($.if('*.js', gulp.dest('www')));
    });

    gulp.task('app-modules-watch', () => {
        gulp.watch('app/scripts/kano/app-modules/**/*')
            .on('change', (e) => {
                $.utils.notifyUpdate(`File ${e.path} was ${e.type}...`);
                processModules().pipe($.if('*.js', gulp.dest('www')));
            });
    });
};
