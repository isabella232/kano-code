'use strict';
let http = require('http'),
    fs = require('fs'),
    path = require('path'),
    StreamCache = require('stream-cache'),
    cache = {},
    server;


function getFileStream(filepath) {
    cache[filepath] = new StreamCache();
    fs.createReadStream(filepath).pipe(cache[filepath]);
    return cache[filepath];
}

server = http.createServer((req, res) => {
    let filePath = path.join('www', req.url);
    fs.stat(filePath, function (err, stats) {
        if (!err && stats.isFile()) {
            getFileStream(filePath).pipe(res);
        } else {
            getFileStream('./www/index.html').pipe(res);
        }
    });
});


module.exports = server;
