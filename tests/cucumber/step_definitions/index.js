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

    this.Given(/^the (story )?(.+) page is opened$/, function (arg0, arg1, callback) {
        let openApp;
        if (arg0) {
            openApp = this.openStory(arg1);
        } else {
            openApp = this.openApp(arg1);
        }
        openApp
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

    this.Then(/^the user creations are displayed$/, function (callback) {
        this.getDeepElementInView('kano-app-list[view="my"]')
            .then(() => {
                callback();
            })
            .catch(callback);
    });

    this.When(/^the user clicks the (.+)$/, function (arg0, callback) {
        this.clickOnButton(arg0)
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

    this.When(/^the user completes a step$/, function (callback) {
        this.validateStep()
            .then(() => {
                callback();
            })
            .catch(callback);
    });

    this.Then(/^the progress meter updates$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    this.Then(/^(.+) (are|is) displayed$/, function (arg0, arg1, callback) {
        this.assertDisplayed(arg0)
            .then(() => {
                callback();
            })
            .catch(callback);
    });

    this.Then(/^projects that haven't been completed are locked$/, function (callback) {
        this.waitFor('kano-projects a.locked')
            .then(() => {
                callback();
            })
            .catch(callback);
    });

};
