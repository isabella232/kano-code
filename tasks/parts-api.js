"use strict";
module.exports = (gulp, $) => {

    const babelOrCopy = require('./babel-or-copy')(gulp, $);

    function processModule() {
        return babelOrCopy('app/scripts/kano/make-apps/parts-api/parts-api.html', { base: 'app' });
    }

    /**
     * No need to babelify here, this code will be sent to a node environment
     */
    gulp.task('parts-api', () => {
        processModule().pipe($.if('*.js', gulp.dest('www')));
    });

    gulp.task('parts-api-watch', () => {
        gulp.watch('app/scripts/kano/make-apps/parts-api/**/*')
            .on('change', (e) => {
                $.utils.notifyUpdate(`File ${e.path} was ${e.type}...`);
                processModule().pipe($.if('*.js', gulp.dest('www')));
            });
    });
};
