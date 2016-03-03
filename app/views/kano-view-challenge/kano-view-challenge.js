class KanoViewChallenge {
    beforeRegister () {
        this.is = 'kano-view-challenge';
        this.properties = {
            selected: {
                type: Number,
                value: 0,
                observer: 'selectedChanged'
            },
            challenge: {
                type: Object,
                observer: 'selectedChanged'
            }
        };
    }
    attached () {
        app.challenges.getById(app.ctx.params.id)
            .then((challenge) => {
                this.set('challenge', challenge);
            });
    }
    isSelected (index) {
        return index === this.selected;
    }
    nextBoard () {
        if (this.selected < this.challenge.boards.length - 1) {
            this.selected++;
        }
    }
    selectedChanged () {
        if (!this.challenge) {
            return;
        }
        app.challenges.getBoardByIndex(this.challenge, this.selected)
            .then((board) => {
                this.set('board', board);
            });
    }
}

Polymer(KanoViewChallenge);
