module.exports = function () {
    this.World = require('../support/world').World;

    this.When(/^I click on (the )?(.+)$/, function (arg0, arg1) {
        let p, m;
        if (arg1.endsWith(' of the added part')) {
            let partId = this.store.addedPartId;
            arg1 = arg1.replace(' of the added part', '');
            if (!partId) {
                return Promise.reject('Could not retrieve added part');
            }
            p = this.getEditorElement('Default workspace')
                .then(el => {
                    let selector = `.part-list #part-${partId}`;
                    switch (arg1.toLowerCase()) {
                        case 'remove button':
                            selector += ' .remove';
                            break;
                        default:
                            break;
                    }
                    return this.findElement(el, [selector]);
                });
        } else if (arg1.endsWith(' in the remove part dialog')) {
            let selector = '[dialog-confirm]';
            arg1 = arg1.replace(' in the remove part dialog', '');

            if (arg1 === 'Cancel') {
                selector = '[dialog-dismiss]';
            }

            p = this.getEditorElement('Confirm part deletion dialog')
                .then(dialog => this.findElement(dialog, [selector]));
        } else if (arg1.endsWith(' in the Add Parts Dialog')) {
            arg1 = arg1.replace(' in the Add Parts Dialog', '');
            return this.getEditorElement('Add Parts Dialog')
                // Ensure animations finished
                .then(dialog => {
                    return this.wait(500).then(() => dialog);
                })
                .then(dialog => {
                    if (arg1 === 'a part') {
                        return this.addPart(dialog)
                            .then(partId => this.store.addedPartId = partId);
                    } else if (arg1 === 'done') {
                        return this.getEditorElement('done in add parts dialog')
                            .then(button => button.click());
                    }
                });
        } else if (arg1.endsWith(' in the part list')) {
            let m, partId;
            arg1 = arg1.replace(' in the part list', '');
            if (m = arg1.match(/^part '(.+)'$/)) {
                partId = m[1];
                p = this.getEditorElement('Default workspace')
                    .then(el => {
                        let selector = `.part-list #part-${partId}`;
                        return this.findElement(el, [selector]);
                    });
            }
        } else if (m = arg1.match(/ in the part editor$/)) {
            arg1 = arg1.replace(/ in the part editor$/, '');
            if (m = arg1.match(/done button/)) {
                p = this.getPartEditor().then(editorElement => {
                    return this.findElement(editorElement, ['kano-part-editor-topbar', '#done']);
                });
            }
        } else {
            p = this.getEditorElement(arg1);
        }
        return p.then(el => el.click());
    });

    this.When(/^I type '(.+)' in (the )?(.+)$/, function (arg0, arg1, arg2) {
        let p = Promise.resolve(),
            m;
        if (m = arg2.match(/part editor name input/)) {
            p = this.getPartEditor().then(editorElement => {
                    return this.driver.executeScript(`return arguments[0].shadowRoot.querySelector('[label="Name"]')`, editorElement);
                });
        }
        return p.then(inputElement => {
            return inputElement.sendKeys(arg0);
        });
    });

    this.When(/^I wait (\d+)(ms)$/, function (arg0, arg1) {
        let delay = parseInt(arg0);
        if (arg1 === 's') {
            delay *= 1000;
        }
        return this.wait(delay);
    });
};
