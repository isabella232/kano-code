'use strict';
let fs = require('fs');
let path = require('path');

function getImports(filePath, opts) {
    let found = [];
    opts = opts || {};

    function crawlImports(filePath) {
        return new Promise((resolve, reject) => {
            let dir = path.dirname(filePath);
            fs.readFile(filePath, (err, file) => {
                if (err) {
                    return resolve();
                }
                found.push(filePath);
                let content = file.toString(),
                importRegex = /<link.*rel="import".*>/gi,
                imports = content.match(importRegex),
                fileRegex,
                files,
                tasks;
                if (!imports) {
                    return resolve();
                }
                fileRegex = /href="(.*)"/,
                files = imports.map((importLine) => {
                    let m = importLine.match(fileRegex);
                    if (m && m[1]) {
                        return path.join(dir, m[1]);
                    }
                    return null;
                }).filter((f) => {
                    if (!f) {
                        return false;
                    }
                    if (found.indexOf(f) === -1) {
                        return true;
                    }
                });
                tasks = files.map((f) => {
                    return crawlImports(f);
                });
                return Promise.all(tasks).then(() => {
                    return resolve(found);
                }).catch(reject);
            });
        });
    }
    return crawlImports(filePath).then((files) => {
        files = files.filter((item, pos, self) => {
            return self.indexOf(item) == pos;
        });
        if (opts.base) {
            files = files.map((filePath) => {
                return path.relative(opts.base, filePath);
            });
        }
        return files;
    });
}

module.exports = getImports;
