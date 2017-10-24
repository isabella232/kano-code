const {defineSupportCode} = require('cucumber');

defineSupportCode(({Then}) => {
    Then(/^(the )?(.+) should (not )?be visible$/, function (arg0, arg1, arg2) {
        return this.getEditorElement(arg1)
            .then((el) => {
                if (arg2) {
                    return this.ensureElementIsNotVisible(el);
                } else {
                    return this.waitForElementToBeVisible(el);
                }
            });
    });

    Then(/^the part '?([a-zA-Z0-9_.-]+)?'? ?should (not )?exist$/, function (arg0, arg1) {
        let partId = arg0 || this.store.addedPartId;
        if (!partId) {
            return Promise.reject('Could not retrieve added part');
        }
        return this.getEditorElement()
            .then(editor => {
                if (arg1) {
                    return this.ensurePartDoesNotExist(editor, partId);
                } else {
                    return this.ensurePartExists(editor, partId);
                }
            });
    });

    Then(/^the block '(.+)' should (not )?exist$/, function (arg0, arg1) {
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
});
