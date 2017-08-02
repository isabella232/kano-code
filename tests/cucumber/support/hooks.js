'use strict';

let world = require('./world'),
    server = require('../../server'),
    libCoverage = require('istanbul-lib-coverage'),
    reports = require('istanbul-reports'),
    libReport = require('istanbul-lib-report'),
    prepareCoverage = require('../../coverage'),
    coverageEnv = !!process.env.COVERAGE,
    hooks;

const SRC = './app';

function generateCoverageReport() {
    return world.getDriver().executeScript('return window.__coverage__')
        .then(coverage => {
            let map = libCoverage.createCoverageMap(coverage);
            let context = libReport.createContext();

            let tree = libReport.summarizers.pkg(map);
            tree.visit(reports.create('lcov'), context);
        });
}

hooks = function () {
    // Instumentalise code if in coverage mode
    let prepare = coverageEnv ? prepareCoverage(SRC) : Promise.resolve(SRC);

    // Start a server to deliver make-apps files
    this.BeforeFeatures((e, callback) => {
        prepare.then(loc => {
            world.init();
            if (!process.env.EXTERNAL_SERVER) {
                server(loc).listen(world.getPort(), callback);
            } else {
                callback();
            }
        });
    });

    this.Before({ order: 1 }, () => {
        world.loginUser();
    });
    // Logout the user on the the tagged scenarios
    this.Before({ tags: ["@loggedout"], order: 2 }, () => {
        world.logoutUser();
    });

    // Take a screeshot if the scenario failed and attach it to the scenario report
    this.After((scenario, callback) => {
        if (scenario.isFailed()) {
            world.getDriver().takeScreenshot().then((stream) => {
                scenario.attach(stream, 'image/png', callback);
            }).catch(callback);
        } else {
            callback();
        }
    });

    this.After((scenario, callback) => {
        let driver = world.getDriver();
        if (scenario.isFailed()) {
            driver.manage().logs().get('browser')
                .then((logs) => {
                    logs.forEach((log) => console.log(`${log.level.name_}: ${log.message}`));
                    callback();
                }).catch(callback);
        } else {
            callback();
        }
    });

    // Close the browser
    this.AfterFeatures((e, callback) => {
        let finalise = coverageEnv ? generateCoverageReport() : Promise.resolve();
        return finalise
                .then(() => world.getDriver().quit())
                .then(() => callback())
                .catch(callback);
    });
};

module.exports = hooks;
