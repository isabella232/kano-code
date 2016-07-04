'use strict';
let path = require('path'),
    glob = require('glob');


const globs = [
    '../www/views/**/*',
    '../www/elements/**/*.{html,js}',
    '../www/scripts/**/*',
    '../www/index.html',
    '../www/manifest.json',
    '../www/sw.js',
    '../www/css/*.css',
    '../www/assets/**/*.{png,svg,eot,woff,ttf, html,js,json}'
];

function getFiles(pattern) {
    return new Promise((resolve, reject) => {
        glob(pattern, { nodir: true }, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        });
    });
}

function getCacheable() {
    let p = globs.map((pattern) => getFiles(path.join(__dirname, pattern)));

    return Promise.all(p).then(groups => groups.reduce((acc, files) => acc.concat(files), []))
        .then(files => files.map(file => file.replace(path.join(__dirname, '../www'), '')));
}

module.exports = getCacheable;
