module.exports = function () {
    this.World = require('../support/world').World;

    this.Then(/^(the )?(.+) should (not )?be visible$/, function (arg0, arg1, arg2) {
        return this.getEditorElement(arg1)
            .then((dialog) => {
                if (arg2) {
                    return this.ensureElementIsNotVisible(dialog);
                } else {
                    return this.waitForElementToBeVisible(dialog);
                }
            });
    });

    this.Then(/^the part ('(.+)' )?should (not )?exist$/, function (arg0, arg1, arg2) {
        let partId = arg1 || this.store.addedPartId;
        if (!partId) {
            return Promise.reject('Could not retrieve added part');
        }
        return this.getEditorElement()
            .then(editor => {
                if (arg2) {
                    return this.ensurePartDoesNotExist(editor, partId);
                } else {
                    return this.ensurePartExists(editor, partId);
                }
            });
    });

    this.Then(/^the block '(.+)' should (not )?exist$/, function (arg0, arg1) {
        let blockType = arg0;
        return this.getEditorElement()
            .then(editor => {
                if (arg1) {
                    return this.ensureBlockDoesNotExist(editor, blockType);
                } else {
                    return this.ensureBlockExists(editor, blockType);
                }
            });
    });

};
