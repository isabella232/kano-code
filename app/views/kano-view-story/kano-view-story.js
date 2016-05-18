/* globals Polymer, KanoBehaviors, app, page */
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
            },
            ctx: {
                type: Object
            }
        };
    }
    attached () {
        this.modal = this.$['share-modal'];
        app.registerBlockly(window.Blockly);
        app.stories.getById(app.ctx.params.id)
            .then((story) => {
                if (typeof story.next === 'string') {
                    return app.stories.getById(story.next)
                        .then((nextStory) => {
                            story.next = nextStory;
                            return story;
                        });
                }
                return story;
            })
            .then((story) => {
                this.story = story;
                return app.progress.loadProgress(story.progress.group);
            })
            .then((progress) => this.updateExtensions(progress));
    }
    updateExtensions (progress) {
        let story = this.story,
            extensions = story.extensions,
            progressGroup = progress[story.progress.group] || {},
            progressExtensions = progressGroup.extensions;
        if (story.extensions && progressExtensions) {
            for (let i = 0, len = extensions.length; i < len; i++) {
                if (progressExtensions.indexOf(extensions[i].id) !== -1) {
                    this.set(`story.extensions.${i}.completed`, true);
                }
            }
        }
    }
    isSelected (index) {
        return index === this.selected;
    }
    nextScene () {
        if (this.selected < this.story.scenes.length - 1) {
            this.selected++;
        } else {
            //story completed!!!
            let progress = this.story.progress,
                extension = this.story.extension ? this.story.id : null;
            app.progress.updateProgress(progress.group, progress.storyNo, extension)
                .then((progress) => this.updateExtensions(progress));
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
    extendStory (e) {
        let extensionId = e.detail;
        page.redirect(`/story/${extensionId}`);
    }
    nextStory (e) {
        let storyId;
        if (!this.story.next) {
            return;
        }
        storyId = this.story.next.id;
        page.redirect(`/story/${storyId}`);
    }
}

Polymer(KanoViewStory);
