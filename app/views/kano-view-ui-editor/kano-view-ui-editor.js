class KanoViewUiEditor {
    beforeRegister () {
        this.is = 'kano-view-ui-editor';
        this.properties = {
            step: {
                type: Number,
                value: 0,
                observer: 'stepChanged'
            }
        };
    }
    attached () {
        this.toolbox = [{
            name: 'Test',
            blocks: [{
                id: 'text'
            }]
        },{
            name: 'Second',
            blocks: [{
                id: 'text_join'
            }]
        }];
        this.steps = [{
            instruction: `Take the 'text' block and add it to the workspace`,
            validation: {
                create: {
                    type: 'text'
                }
            }
        }];
    }
    stepChanged () {
        this.instruction = this.steps[this.step].instruction;
    }
    blocklyChanged (e) {
        let step = this.steps[this.step];
        if (step.validation.create && e.detail instanceof Blockly.Events.Create) {
            let validation = step.validation.create,
                type;
            if (typeof validation === 'string') {
                type = validation;
            } else if (validation.type) {
                type = validation.type;
            } else {
                return;
            }
            if (e.detail.xml.getAttribute('type') === type) {
                this.nextStep();
            }
        }
    }
    nextStep () {
        if (this.step < this.steps.length - 1) {
            this.step++;
        }
    }
}

Polymer(KanoViewUiEditor);
