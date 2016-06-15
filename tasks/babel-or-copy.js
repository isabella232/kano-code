'use strict';
module.exports = (gulp, $) => {
    /**
     * Skip babel if the target env is ES6 capable
     */
    function babelOrCopy(src, opts) {
        let stream = gulp.src(src, opts);
        if (!process.env.ES6) {
            stream = stream
                .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
                .pipe($.if('*.html', $.utils.htmlAutoprefixerStream()))
                .pipe($.if('*.js', $.babel({ presets: ['es2015'] })));
        }
        return stream;
    }
    return babelOrCopy;
};
