const path = require('path');
const {defineSupportCode} = require('cucumber');

defineSupportCode(({Given}) => {
    Given(/^that a user is logged (out|in)$/, function (arg0, callback) {
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

    Given(/^the (story )?(.+) page is opened$/, function (arg0, arg1) {
        let openApp;
        if (arg0) {
            openApp = this.openStory(arg1);
        } else {
            openApp = this.openApp(arg1);
        }
        return openApp;
    });

    Given(/^I add a part$/, function () {
        return this.openAddPartsDialog()
            .then(dialog => this.addPart(dialog))
            .then(partId => this.store.addedPartId = partId);
    });

    Given(/^the loaded app is (.+)$/, function (arg0) {
        let filePath = path.join(__dirname, '../../resources/apps', arg0);
        return this.loadAppInStorage(filePath + '.kcode');
    });
});
