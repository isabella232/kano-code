class KanoViewUiEditor {
    beforeRegister () {
        this.is = 'kano-view-ui-editor';
    }
    attached () {
        app.challenges.getById('dummy')
            .then(challenge => app.challenges.getBoardByIndex(challenge, 0))
            .then((board) => {
                this.set('steps', board.steps);
            });
    }
}

Polymer(KanoViewUiEditor);
