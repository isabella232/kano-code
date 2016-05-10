/* globals Polymer, KanoBehaviors, app, Blockly */
class KanoViewStory {

    get behaviors () {
        return [KanoBehaviors.SharingBehavior];
    }

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
        this.modal = this.$['share-modal'];
        app.stories.getById(app.ctx.params.id)
            .then((story) => {
                this.set('story', story);
                app.registerBlockly(window.Blockly);
            });
    }
    isSelected (index) {
        return index === this.selected;
    }
    nextScene () {
        if (this.selected < this.story.scenes.length - 1) {
            this.selected++;
        } else {
            //story completed!!!
            let progress = this.story.progress;
            console.log(this.story);
            app.progress.updateProgress(progress.group, progress.storyNo);
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
