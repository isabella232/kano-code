class KanoViewStory {
    beforeRegister () {
        this.is = 'kano-view-story';
        this.properties = {
            selected: {
                type: Number,
                value: 0,
                observer: 'selectedChanged'
            },
            story: {
                type: Object,
                observer: 'selectedChanged'
            }
        };
    }
    attached () {
        app.stories.getById(app.ctx.params.id)
            .then((story) => {
                this.set('story', story);
                app.registerBlockly(Blockly)
            });
    }
    isSelected (index) {
        return index === this.selected;
    }
    nextScene () {
        if (this.selected < this.story.scenes.length - 1) {
            this.selected++;
        }
    }
    selectedChanged () {
        if (!this.story) {
            return;
        }
        app.stories.getSceneByIndex(this.story, this.selected)
            .then((scene) => {
                this.set('scene', scene);
            });
    }
}

Polymer(KanoViewStory);
