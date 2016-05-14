'use strict';

let world = require('./world'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    server,
    hooks;

// Simple static server
server = http.createServer((req, res) => {
    let filePath = path.join('www', req.url);
    fs.stat(filePath, function (err, stats) {
        if (!err && stats.isFile()) {
            fs.createReadStream(filePath).pipe(res);
        } else {
            fs.createReadStream('./www/index.html').pipe(res);
        }
    });
});

hooks = function () {

    // Start a server to deliver make-apps files
    this.BeforeFeatures((e, callback) => {
        server.listen(world.getPort(), callback);
    });

    // Log the user on each scenario
    this.Before({ order: 1 }, () => {
        world.loginUser();
    });
    // Logout the user on the the tagged scenarios
    this.Before({ tags: ["@loggedout"], order: 2 }, () => {
        world.logoutUser();
    });

    // Close the browser
    this.AfterFeatures((e, callback) => {
        world.getDriver().quit().then(() => {
            callback();
        });
    });
};

module.exports = hooks;
