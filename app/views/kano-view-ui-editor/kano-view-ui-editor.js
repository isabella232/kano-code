class KanoViewUiEditor {
    beforeRegister () {
        this.is = 'kano-view-ui-editor';
    }
    attached () {
        this.toolbox = [{
            name: 'Test',
            blocks: [{
                id: 'text'
            }, {
                id: 'controls_repeat_ext'
            }]
        },{
            name: 'Second',
            blocks: [{
                id: 'text_join'
            },{
                id: 'math_number'
            }]
        }];
        app.challenges.getById('dummy')
            .then(challenge => app.challenges.getBoardByIndex(challenge, 0))
            .then((board) => {
                this.set('steps', board.steps);
            });
    }
}

Polymer(KanoViewUiEditor);
