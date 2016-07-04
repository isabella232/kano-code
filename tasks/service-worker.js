var getCacheable = require('./get-cacheable');

module.exports = (gulp, $) => {
    function updateSW() {
        getCacheable().then((paths) => {
            gulp.src('app/sw.js')
                .pipe($.replace('[/* build:cacheable */]', JSON.stringify(paths)))
                .pipe(gulp.dest('www'));
        });
    }

    gulp.task('sw-generate', updateSW);
    gulp.task('sw-enable', () => {
        gulp.src('www/scripts/index.js')
            .pipe($.replace('/* build:sw */', `if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').then(function (registration) {}).catch(function (err) {});
            }`))
            .pipe(gulp.dest('www/scripts/'));
    });

    gulp.task('sw', ['sw-generate', 'sw-enable']);

    return updateSW;
};
