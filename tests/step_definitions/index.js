'use strict';

module.exports = function () {
    this.World = require('../support/world').World;
    this.Given(/^that a user is logged (out|in)$/, function (arg0, callback) {
        let p;
        if (arg0 === 'in') {
            p = this.loginUser();
        } else {
            p = this.logoutUser();
        }
        p.then(() => {
            callback();
        }).catch(callback);
    });

    this.Given(/^the (.+) page is opened$/, function (arg0, callback) {
        this.openApp(arg0)
            .then(() => this.waitFor('kano-app'))
            .then(() => this.getDeepElement('kano-app'))
            .then((el) => this.waitForDisplayed(el))
            .then(() => {
                callback();
            })
            .catch(callback);
    });

    this.Then(/^the (.+) page opens$/, function (args0, callback) {
        this.assertCurrentView(args0)
            .then(() => {
                callback();
            })
            .catch(callback);
    });

    this.Then(/^the authentication modal is opened$/, function (callback) {
        this.getDeepElement('kano-app paper-dialog')
            .then((dialog) => this.waitForDisplayed(dialog))
            .then(() => {
                callback();
            })
            .catch(callback);
    });

    this.Then(/^their creations are displayed$/, function (callback) {
        this.getDeepElementInView('kano-app-list[view="my"]')
            .then(() => {
                callback();
            })
            .catch(callback);
    });

    this.When(/^the user clicks the (.+)$/, function (arg0, callback) {
        this.clickOn(arg0)
            .then(() => {
                callback();
            })
            .catch(callback);
    });

    this.Then(/^the first story is loaded$/, function (callback) {
        this.assertCurrentStory(this.firstStory)
            .then(() => {
                callback();
            })
            .catch(callback);
    });

    this.Then(/^the (.+) page is loaded$/, function (args0, callback) {
        this.assertCurrentPage(args0)
            .then(() => {
                callback();
            })
            .catch(callback);
    });

};
