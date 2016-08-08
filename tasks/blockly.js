'use strict';
module.exports = (gulp, $) => {
    const SRC = 'scripts/kano/make-apps/blockly';
    let bundler = $.browserify(`app/${SRC}/index.js`, { standalone: 'Kano.MakeApps.Blockly' })
            .transform($.babelify.configure({ presets: ['es2015'] }));

    function bundle(target, refresh) {
        return (src) => {
            let stream = bundler
                .bundle()
                .on('error', $.utils.notifyError)
                .pipe($.source('index.js'))
                .pipe(gulp.dest(target));
            if (refresh) {
                stream = stream.pipe($.browserSync.stream());
            }
            return stream;
        };
    }

    gulp.task('blockly-dev', bundle(`www/${SRC}`, true));
    gulp.task('blockly', bundle(`.tmp/app/${SRC}`));

    gulp.task('blockly-watch', () => {
        bundler = bundler.plugin($.watchify).on('update', bundle(`www/${SRC}`, true));
        bundle(`www/${SRC}`, true)();
    });
};
